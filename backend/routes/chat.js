// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { getAIResponse } = require('../services/aiService');

// Save & fetch chat history
router.post('/', async (req, res) => {
  const { sessionId, message } = req.body;

  try {
    // Get AI response (OpenAI/Dialogflow)
    const botReply = await getAIResponse(message);

    // Save to MongoDB
    const chat = await Chat.findOneAndUpdate(
      { sessionId },
      { $push: { messages: [
        { text: message, sender: 'user' },
        { text: botReply, sender: 'bot' }
      ] }},
      { upsert: true, new: true }
    );

    res.json({ reply: botReply, chatId: chat._id });
  } catch (err) {
     console.log('Error in chat route:', err);
    res.status(500).json({ error: 'AI response failed' });
  }
});

module.exports = router;