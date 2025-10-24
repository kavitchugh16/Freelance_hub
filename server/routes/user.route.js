// In server/src/routes/user.route.js
const express = require('express');
// 1. IMPORT THE NEW FUNCTION
const { getUser, updateUser, searchUsers } = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/authenticate.js'); // Changed from to match your file

const router = express.Router();

// 2. ADD THE SEARCH ROUTE HERE (must be before /:id)
// All logged-in users can search
router.get('/search', authenticate, searchUsers);

// 3. YOUR EXISTING ROUTES
router.get('/:id', getUser);
router.patch('/:id', authenticate, updateUser);

module.exports = router;