// models/Intent.js
const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema({
  intentId: String, // ID from Dialogflow
  displayName: String,
  trainingPhrases: [String],
  messages: [String], // or [Object] if you need more structure
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Intent', intentSchema);