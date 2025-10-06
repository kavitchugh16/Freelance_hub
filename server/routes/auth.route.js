const express = require('express');
const { registerClient, registerFreelancer, login, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authenticate'); // Import middleware
const User = require('../models/user.model'); // ⚠️ You must create/ensure this import path is correct

const router = express.Router();

// --- Registration and Login/Logout Routes ---
// Client registration
router.post('/register/client', registerClient);

// Freelancer registration
router.post('/register/freelancer', registerFreelancer);

// Login (both)
router.post('/login', login);

// Logout
router.post('/logout', logout);

// --- 🔑 NEW: Session Check Route to Solve Reload Problem ---
/**
 * @route GET /api/auth/session
 * @desc Checks for a valid HTTP-only cookie and returns user data if session is active.
 * @access Private (via Cookie)
 */
router.get('/session', authenticate, async (req, res) => {
    try {
        // req.user is populated by the 'authenticate' middleware from the JWT in the cookie
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            // This case should rarely happen if the token is valid, but good to handle
            return res.status(404).json({ message: 'User data not found for valid token.' });
        }

        // Return user data (without password) to the frontend context
        res.status(200).json({ user: user._doc });
    } catch (error) {
        // If an error occurs (e.g., database lookup fails), return a server error
        console.error('Session retrieval error:', error);
        res.status(500).json({ message: 'Server error during session retrieval.' });
    }
});

module.exports = router;