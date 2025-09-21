// Create new file: server/src/routes/review.route.js

const express = require('express');
const { createReview, getReviewsForUser } = require('../controllers/review.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Protected route for a user to create a new review
// POST /api/reviews
router.post('/', authenticate, createReview);

// Public route to get all reviews for a specific user
// GET /api/reviews/user/:userId
router.get('/user/:userId', getReviewsForUser);

module.exports = router;