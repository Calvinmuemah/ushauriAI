const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  conversationId: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() }, 
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  timestamp: { type: Date, default: Date.now },
});

chatHistorySchema.index({ conversationId: 1, timestamp: 1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;