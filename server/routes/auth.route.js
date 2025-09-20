// In server/src/routes/auth.route.js

const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller.js');

const router = express.Router();

// Route for user registration
// POST /api/auth/register
router.post('/register', register);

// Route for user login
// POST /api/auth/login
router.post('/login', login);

// Route for user logout
// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;