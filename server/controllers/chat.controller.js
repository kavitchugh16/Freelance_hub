const Conversation = require('../models/conversation.model.js');
const Message = require('../models/message.model.js');
const User = require('../models/user.model.js'); // We need this to find users

/**
 * Gets or creates a conversation between the logged-in user and another user.
 */
exports.getOrCreateConversation = async (req, res) => {
  const { recipientId } = req.body; // The ID of the user to chat with
  const senderId = req.user._id; // From the 'authenticate' middleware

  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient ID is required.' });
  }

  try {
    // Check if a conversation between these two users already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    }).populate('participants', 'username profile.fullName profile.avatar'); // Populate participant details

    // If no conversation exists, create a new one
    if (!conversation) {
      // Check if recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient user not found.' });
      }

      conversation = new Conversation({
        participants: [senderId, recipientId],
      });
      await conversation.save();
      // Re-populate to get the details in the same format
      conversation = await Conversation.findById(conversation._id).populate(
        'participants',
        'username profile.fullName profile.avatar'
      );
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Gets all conversations for the currently logged-in user.
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username profile.fullName profile.avatar') // Get user details
      .populate('lastMessage.sender', 'username') // Get sender of last message
      .sort({ updatedAt: -1 }); // Show most recent conversations first

    // Filter out the 'self' user from the participants list for easier frontend display
    const filteredConversations = conversations.map((convo) => {
      const otherParticipant = convo.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      // Create a new object to avoid modifying the original
      return {
        ...convo.toObject(),
        // Add a field for the 'other' user
        recipient: otherParticipant, 
      };
    });

    res.status(200).json(filteredConversations);
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Gets all messages for a specific conversation.
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // First, check if the user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access Denied: You are not part of this conversation.' });
    }

    // If they are, fetch the messages
    const messages = await Message.find({ conversationId })
      .populate('sender', 'username profile.fullName profile.avatar') // Get sender's details
      .sort({ createdAt: 1 }); // Show oldest messages first

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};