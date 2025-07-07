// backend/services/aiService.js
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');

// Load Dialogflow key
const CREDENTIALS = path.join(__dirname, '../dialogflow-key.json');
const projectId = process.env.GOOGLE_PROJECT_ID;
const languageCode = process.env.DIALOGFLOW_LANGUAGE_CODE || 'en';

exports.getAIResponse = async (message) => {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: CREDENTIALS,
  });

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result.fulfillmentText;
};

const client = new dialogflow.IntentsClient({
  keyFilename: '../dialogflow-key.json',
});