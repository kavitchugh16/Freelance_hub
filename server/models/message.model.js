const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // The ID of the conversation this message belongs to
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    // The ID of the user who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This 'User' must match the model name in user.model.js
      required: true,
    },
    // The text content of the message
    text: {
      type: String,
      required: true,
    },
    // We can add a 'read' status later if needed
    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;