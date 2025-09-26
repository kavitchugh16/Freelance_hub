
const express = require('express');
const { createReview, getReviewsForUser } = require('../controllers/review.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

router.post('/', authenticate, createReview);

router.get('/user/:userId', getReviewsForUser);

module.exports = router;