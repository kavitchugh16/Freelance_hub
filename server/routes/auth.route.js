const express = require('express');
const { registerClient, registerFreelancer, login, logout } = require('../controllers/auth.controller');
// ✅ FIX: Changed the import path to the correct middleware file
const { authenticate } = require('../middlewares/auth.middleware.js'); 
const User = require('../models/user.model'); // Ensure path is correct

const router = express.Router();

// Client registration
router.post('/register/client', registerClient);

// Freelancer registration
router.post('/register/freelancer', registerFreelancer);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Session check
router.get('/session', authenticate, async (req, res) => {
  try {
    // Note: The user object is already attached by the updated auth.middleware.js
    // We just need to ensure the response format is correct.
    res.status(200).json({ user: req.user });
  } catch (error)
 {
    console.error('Session retrieval error:', error);
    res.status(500).json({ message: 'Server error during session retrieval.' });
  }
});

module.exports = router;