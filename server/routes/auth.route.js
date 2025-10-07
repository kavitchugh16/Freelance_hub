const express = require('express');
const { registerClient, registerFreelancer, login, logout } = require('../controllers/auth.controller');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 
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
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User data not found for valid token.' });
    res.status(200).json({ user: user._doc });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({ message: 'Server error during session retrieval.' });
  }
});

module.exports = router;
