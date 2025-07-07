const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');
const Chat = require('../models/Chat');
const Intent = require('../models/Intent');
const { IntentsClient } = require('@google-cloud/dialogflow');
const location = 'global';

const CREDENTIALS = path.join(__dirname, '../dialogflow-key.json');
const projectId = process.env.GOOGLE_PROJECT_ID;

const sessionClient = new dialogflow.SessionsClient({
     keyFilename: CREDENTIALS,
});

const intentsClient = new dialogflow.IntentsClient({
     keyFilename: CREDENTIALS,
});

// Get all intents
exports.getIntents = async (req, res) => {
     try {
          const parent = intentsClient.projectAgentPath(projectId);
          const [intents] = await intentsClient.listIntents({ parent });

          // Process intents to get proper counts
          const processedIntents = intents.map(intent => ({
               name: intent.name,
               displayName: intent.displayName,
               trainingPhrasesParts: intent.trainingPhrases.map(tp => tp.parts.map(p => p.text).join('')),
               trainingPhrases: intent.trainingPhrases,
               messages: intent.messages.map(m => m.text.text.join(' ')),
          }));

          res.json(processedIntents);
     } catch (err) {
          console.error('Error getting intents:', err);
          res.status(500).json({ error: 'Failed to get intents' });
     }
};

// Create new intent
exports.createIntent = async (req, res) => {
  try {
    const { displayName, trainingPhrases, messages } = req.body;

    // 1. Create intent in Dialogflow
    const parent = intentsClient.projectAgentPath(process.env.GOOGLE_PROJECT_ID);
    
    const intent = {
      displayName,
      trainingPhrases: trainingPhrases.map(phrase => ({
        type: 'EXAMPLE',
        parts: [{ text: phrase }]
      })),
      messages: [{
        text: { text: messages }
      }]
    };

    const [dialogflowIntent] = await intentsClient.createIntent({
      parent,
      intent
    });

    // 2. Save intent to MongoDB
    const mongoIntent = new Intent({
      intentId: dialogflowIntent.name.split('/').pop(), // Extract the intent ID
      displayName,
      trainingPhrases,
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await mongoIntent.save();

    // 3. Return combined response
    res.json({
      dialogflow: dialogflowIntent,
      mongo: mongoIntent
    });

  } catch (err) {
    console.error('Error creating intent:', err);
    
    // If Dialogflow succeeded but MongoDB failed, you might want to delete the Dialogflow intent
    // Consider adding cleanup logic here if needed
    
    res.status(500).json({ 
      error: 'Failed to create intent',
      details: err.message 
    });
  }
};

// Get chat analytics
exports.getChatAnalytics = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const now = new Date();
    
    // Calculate date ranges based on the selected period
    const { startDate, prevPeriodStart } = calculateDateRanges(range, now);

    // 1. Get data from Dialogflow
    const [intents] = await intentsClient.listIntents({
      parent: intentsClient.projectAgentPath(process.env.GOOGLE_PROJECT_ID)
    });

    // 2. Get chat data from MongoDB for both current and previous periods
    const currentChats = await Chat.find({
      'messages.timestamp': { $gte: startDate }
    });
    
    const previousChats = await Chat.find({
      'messages.timestamp': { 
        $gte: prevPeriodStart,
        $lt: startDate
      }
    });

    // 3. Calculate basic metrics
    const totalMessages = currentChats.reduce((sum, chat) => sum + chat.messages.length, 0);
    
    // 4. Calculate intent-related metrics
    const { intentMessages, responseTimes, intentCounts, intentSatisfaction } = processChatMessages(currentChats);

    // 5. Calculate platform satisfaction
    const platformSatisfaction = calculatePlatformSatisfaction(intentSatisfaction);

    // 6. Calculate average response time
    const avgResponseTime = calculateAverageResponseTime(responseTimes, intentCounts);

    // 7. Get popular intents
    const popularIntents = getPopularIntents(intentMessages, intents, intentSatisfaction, currentChats);

    // 8. Calculate trends by comparing with previous period
    const previousStats = processChatMessages(previousChats);
    const messageChange = calculateTrend(
      totalMessages,
      previousChats.reduce((sum, chat) => sum + chat.messages.length, 0)
    );
    
    const responseTimeChange = calculateTrend(
      avgResponseTime,
      calculateAverageResponseTime(previousStats.responseTimes, previousStats.intentCounts)
    );
    
    const satisfactionChange = calculateTrend(
      platformSatisfaction,
      calculatePlatformSatisfaction(previousStats.intentSatisfaction)
    );

    // 9. Prepare final response
    const analytics = {
      totalIntents: intents.length,
      totalMessages,
      avgResponseTime,
      platformSatisfaction,
      messagesPerDay: calculateMessagesPerDay(currentChats, range, now),
      messageData: generateRealMessageData(currentChats, range, now),
      popularIntents,
      responseTimes: Object.entries(responseTimes)
        .map(([intent, totalTime]) => ({
          intent,
          time: parseFloat((totalTime / (intentCounts[intent] || 1) / 1000).toFixed(2))
        }))
        .sort((a, b) => b.time - a.time),
      messageChange,
      responseTimeChange,
      satisfactionChange
    };

    res.json(analytics);
  } catch (err) {
    console.error('Error getting analytics:', err);
    res.status(500).json({ 
      error: 'Failed to get analytics',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper Functions Implementation

function calculateDateRanges(range, now) {
  let startDate, prevPeriodStart;
  
  switch (range) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      prevPeriodStart = new Date(new Date(startDate).setDate(startDate.getDate() - 1));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      prevPeriodStart = new Date(new Date(startDate).setMonth(startDate.getMonth() - 1));
      break;
    case 'week':
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
      prevPeriodStart = new Date(new Date(startDate).setDate(startDate.getDate() - 7));
  }
  
  return { startDate, prevPeriodStart };
}

function processChatMessages(chats) {
  const intentMessages = {};
  const responseTimes = {};
  const intentCounts = {};
  const intentSatisfaction = {};
  
  chats.forEach(chat => {
    chat.messages.forEach((msg, index) => {
      if (msg.intent) {
        // Count messages per intent
        intentMessages[msg.intent] = (intentMessages[msg.intent] || 0) + 1;
        
        // Calculate response times
        if (msg.sender === 'user' && chat.messages[index + 1]?.sender === 'bot') {
          const responseTime = new Date(chat.messages[index + 1].timestamp) - new Date(msg.timestamp);
          responseTimes[msg.intent] = (responseTimes[msg.intent] || 0) + responseTime;
          intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
        }

        // Track satisfaction
        if (msg.satisfactionScore) {
          intentSatisfaction[msg.intent] = (intentSatisfaction[msg.intent] || []);
          intentSatisfaction[msg.intent].push(msg.satisfactionScore);
        }
      }
    });
  });
  
  return { intentMessages, responseTimes, intentCounts, intentSatisfaction };
}

function calculatePlatformSatisfaction(intentSatisfaction) {
  const allScores = Object.values(intentSatisfaction).flat();
  return allScores.length > 0 
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length * 100))
    : 0;
}

function calculateAverageResponseTime(responseTimes, intentCounts) {
  const totalResponseTime = Object.values(responseTimes).reduce((a, b) => a + b, 0);
  const totalResponses = Object.values(intentCounts).reduce((a, b) => a + b, 0);
  return totalResponses > 0 
    ? parseFloat((totalResponseTime / totalResponses / 1000).toFixed(2))
    : 0;
}

function getPopularIntents(intentMessages, intents, intentSatisfaction, chats) {
  return Object.entries(intentMessages)
    .map(([name, count]) => {
      const intent = intents.find(i => i.name === name);
      const scores = intentSatisfaction[name] || [];
      const satisfaction = scores.length > 0 
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length * 100))
        : null;
      
      return {
        name,
        displayName: intent?.displayName || name.split('/').pop(),
        count,
        satisfaction,
        lastUsed: getLastUsedDate(name, chats)
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getLastUsedDate(intentName, chats) {
  let lastUsed = null;
  
  chats.forEach(chat => {
    chat.messages.forEach(msg => {
      if (msg.intent === intentName) {
        const msgDate = new Date(msg.timestamp);
        if (!lastUsed || msgDate > lastUsed) {
          lastUsed = msgDate;
        }
      }
    });
  });
  
  return lastUsed;
}

function calculateTrend(currentValue, previousValue) {
  if (previousValue === 0 || currentValue === 0) return 0;
  return Math.round(((currentValue - previousValue) / previousValue) * 100);
}

function calculateMessagesPerDay(chats, range, now) {
  const messagesPerDay = {};
  const daysInRange = range === 'month' ? 30 : range === 'week' ? 7 : 1;
  
  // Initialize all dates in range with 0
  for (let i = 0; i < daysInRange; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    messagesPerDay[dateKey] = 0;
  }
  
  // Count messages per day
  chats.forEach(chat => {
    chat.messages.forEach(msg => {
      const dateKey = new Date(msg.timestamp).toISOString().split('T')[0];
      if (messagesPerDay.hasOwnProperty(dateKey)) {
        messagesPerDay[dateKey]++;
      }
    });
  });
  
  // Convert to sorted array
  return Object.entries(messagesPerDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function generateRealMessageData(chats, range, now) {
  const messageData = {
    userMessages: {},
    botMessages: {}
  };
  
  const daysInRange = range === 'month' ? 30 : range === 'week' ? 7 : 1;
  
  // Initialize dates
  for (let i = 0; i < daysInRange; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    messageData.userMessages[dateKey] = 0;
    messageData.botMessages[dateKey] = 0;
  }
  
  // Count messages
  chats.forEach(chat => {
    chat.messages.forEach(msg => {
      const dateKey = new Date(msg.timestamp).toISOString().split('T')[0];
      if (msg.sender === 'user' && messageData.userMessages.hasOwnProperty(dateKey)) {
        messageData.userMessages[dateKey]++;
      } else if (msg.sender === 'bot' && messageData.botMessages.hasOwnProperty(dateKey)) {
        messageData.botMessages[dateKey]++;
      }
    });
  });
  
  // Convert to array
  const allDates = new Set([
    ...Object.keys(messageData.userMessages),
    ...Object.keys(messageData.botMessages)
  ]);
  
  return Array.from(allDates)
    .map(date => ({
      date,
      userMessages: messageData.userMessages[date] || 0,
      botMessages: messageData.botMessages[date] || 0
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
//


// Update intent
exports.updateIntent = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, trainingPhrases, messages } = req.body;

    console.log("Received data:", { displayName, trainingPhrases, messages }); // Debug

    // Validate input
    if (!Array.isArray(trainingPhrases)) {
      return res.status(400).json({ message: 'trainingPhrases must be an array' });
    }
    if (!Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages must be an array' });
    }

    // Build Dialogflow intent name
    const intentPath = `projects/${projectId}/agent/intents/${id}`;

    // Format for Dialogflow
    const formattedTrainingPhrases = trainingPhrases.map(phrase => ({
      type: 'EXAMPLE',
      parts: [{ text: String(phrase) }], // Ensure string conversion
    }));

    const formattedMessages = [{
      text: {
        text: messages.map(msg => String(msg)), // Ensure string conversion
      },
    }];

    // Update Dialogflow
    const [dialogflowResponse] = await intentsClient.updateIntent({
      intent: {
        name: intentPath,
        displayName: String(displayName),
        trainingPhrases: formattedTrainingPhrases,
        messages: formattedMessages,
      },
      updateMask: {
        paths: ['display_name', 'training_phrases', 'messages'],
      },
    });

    // Update MongoDB
    const updatedIntent = await Intent.findOneAndUpdate(
      { intentId: id },
      {
        displayName,
        trainingPhrases, // Store original array
        messages,       // Store original array
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({
      message: 'Intent updated successfully',
      dialogflowIntent: dialogflowResponse.name, // Return just the name
      mongoIntent: {
        id: updatedIntent._id,
        displayName: updatedIntent.displayName,
        trainingPhrases: updatedIntent.trainingPhrases,
        messages: updatedIntent.messages
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper functions
function calculateMessagesPerDay(chats, range) {
     const now = new Date();
     let startDate;

     // Determine the date range
     switch (range) {
          case 'day':
               startDate = new Date(now.setDate(now.getDate() - 1));
               break;
          case 'week':
               startDate = new Date(now.setDate(now.getDate() - 7));
               break;
          case 'month':
               startDate = new Date(now.setMonth(now.getMonth() - 1));
               break;
          default:
               startDate = new Date(now.setDate(now.getDate() - 7)); // Default to week
     }

     // Initialize an object to hold counts per day
     const messagesPerDay = {};

     // Iterate through all chats and messages
     chats.forEach(chat => {
          chat.messages.forEach(msg => {
               const messageDate = new Date(msg.timestamp);

               // Only count messages within the selected range
               if (messageDate >= startDate) {
                    const dateKey = messageDate.toISOString().split('T')[0]; // YYYY-MM-DD format

                    if (!messagesPerDay[dateKey]) {
                         messagesPerDay[dateKey] = 0;
                    }
                    messagesPerDay[dateKey]++;
               }
          });
     });

     // Convert to array of { date, count } objects sorted by date
     return Object.entries(messagesPerDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function generateRealMessageData(chats, range) {
     const now = new Date();
     let startDate;

     // Determine the date range (same as above)
     switch (range) {
          case 'day':
               startDate = new Date(now.setDate(now.getDate() - 1));
               break;
          case 'week':
               startDate = new Date(now.setDate(now.getDate() - 7));
               break;
          case 'month':
               startDate = new Date(now.setMonth(now.getMonth() - 1));
               break;
          default:
               startDate = new Date(now.setDate(now.getDate() - 7)); // Default to week
     }

     // Initialize data structure
     const messageData = {
          userMessages: {},
          botMessages: {}
     };

     // Count messages by type (user/bot) per day
     chats.forEach(chat => {
          chat.messages.forEach(msg => {
               const messageDate = new Date(msg.timestamp);

               if (messageDate >= startDate) {
                    const dateKey = messageDate.toISOString().split('T')[0];
                    const isUserMessage = msg.sender === 'user'; // Adjust based on your message structure

                    // Initialize if not exists
                    if (!messageData.userMessages[dateKey]) {
                         messageData.userMessages[dateKey] = 0;
                    }
                    if (!messageData.botMessages[dateKey]) {
                         messageData.botMessages[dateKey] = 0;
                    }

                    // Increment appropriate counter
                    if (isUserMessage) {
                         messageData.userMessages[dateKey]++;
                    } else {
                         messageData.botMessages[dateKey]++;
                    }
               }
          });
     });

     // Get all unique dates
     const allDates = new Set([
          ...Object.keys(messageData.userMessages),
          ...Object.keys(messageData.botMessages)
     ]);

     // Convert to array of { date, userMessages, botMessages } objects
     return Array.from(allDates)
          .map(date => ({
               date,
               userMessages: messageData.userMessages[date] || 0,
               botMessages: messageData.botMessages[date] || 0
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
}
// Delete intent
// Delete intent
exports.deleteIntent = async (req, res) => {
  try {
    // Validate projectId exists
    if (!projectId) {
      throw new Error('Google Cloud Project ID is not configured');
    }
    // Get and validate intentId
    const intentId = req.params.encodedIntentName;
    if (!intentId) {
      return res.status(400).json({ 
        success: false,
        error: 'Intent ID is required' 
      });
    }

    console.log(`Deleting intent with ID: ${intentId} from project: ${projectId}`);

    // Construct the intent path
    const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
    console.log('Intent path:', intentPath);

    // 1. First delete from MongoDB to prevent orphaned references
    const mongoResult = await Intent.findOneAndDelete({ intentId });
    if (!mongoResult) {
      console.warn(`Intent ${intentId} not found in MongoDB`);
    }

    // 2. Delete from Dialogflow
    try {
      await intentsClient.deleteIntent({ name: intentPath });
      console.log('Successfully deleted from Dialogflow');
    } catch (dialogflowError) {
      console.error('Dialogflow deletion error:', dialogflowError);
      // If Dialogflow fails but MongoDB succeeded, recreate the MongoDB record
      if (mongoResult) {
        await Intent.create(mongoResult);
      }
      throw dialogflowError;
    }

    res.json({
      success: true,
      message: 'Intent deleted successfully',
      deletedFromDialogflow: true,
      deletedFromMongoDB: !!mongoResult,
      intentId: intentId
    });

  } catch (err) {
    console.error('Complete deletion error:', err);
    
    // Enhanced error classification
    let errorMessage = 'Failed to delete intent';
    let statusCode = 500;
    
    if (err.message.includes('INVALID_ARGUMENT')) {
      errorMessage = 'Invalid intent identifier format';
      statusCode = 400;
    } else if (err.message.includes('NOT_FOUND')) {
      errorMessage = 'Intent not found in Dialogflow';
      statusCode = 404;
    } else if (err.message.includes('Project ID is not configured')) {
      errorMessage = 'Server configuration error - missing Google Cloud Project ID';
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      intentId: req.params.id
    });
  }
};


exports.getIntent = async (req, res) => {
  try {
    const intentId = req.params.id;

    // ✅ Construct full Dialogflow intent name
    const intentFullName = `projects/${projectId}/agent/intents/${intentId}`;

    console.log('Fetching intent:', intentFullName);

    const [intent] = await intentsClient.getIntent({
      name: intentFullName,
      intentView: 'INTENT_VIEW_FULL',
    });

    res.json({
      success: true,
      intent: {
        name: intent.name,
        displayName: intent.displayName,
        trainingPhrases: intent.trainingPhrases || [],
        messages: intent.messages || [],
      },
    });
  } catch (error) {
    console.error('Error fetching intent:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch intent',
      error: error.message,
    });
  }
};