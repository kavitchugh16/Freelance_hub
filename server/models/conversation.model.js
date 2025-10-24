const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    // Array of user IDs participating in this conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This 'User' must match the model name in user.model.js
      },
    ],
    // The last message sent in this conversation (for previews)
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;