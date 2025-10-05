const express = require('express');
const { registerClient, registerFreelancer, login, logout } = require('../controllers/auth.controller');

const router = express.Router();

// Client registration
router.post('/register/client', registerClient);

// Freelancer registration
router.post('/register/freelancer', registerFreelancer);

// Login (both)
router.post('/login', login);

// Logout
router.post('/logout', logout);

module.exports = router;
