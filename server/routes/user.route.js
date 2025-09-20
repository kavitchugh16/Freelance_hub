// In server/routes/user.route.js

const express = require('express');
const { getUser, updateUser } = require('../controllers/user.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Public route to view a user's profile
router.get('/:id', getUser);

// Protected route for a user to update their own profile
router.patch('/:id', authenticate, updateUser);

module.exports = router;