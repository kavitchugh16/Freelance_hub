const express = require('express');
const { getConversations, getMessages, getOrCreateConversation } = require('../controllers/chat.controller.js');
const { authenticate } = require('../middlewares/authenticate.js'); // Import your auth middleware

const router = express.Router();

// All chat routes are protected
router.use(authenticate);

// Get all conversations for the logged-in user
router.get('/conversations', getConversations);

// Get or create a conversation with a specific user
router.post('/conversations', getOrCreateConversation);

// Get all messages for a specific conversation
router.get('/messages/:conversationId', getMessages);

module.exports = router;