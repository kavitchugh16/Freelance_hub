// In server/routes/milestone.route.js

const express = require('express');
const { submitMilestone, reviewMilestone } = require('../controllers/milestone.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Protected route for a freelancer to submit a milestone
router.patch('/:milestoneId/submit', authenticate, submitMilestone);

// Protected route for a client to approve or request revisions on a milestone
router.patch('/:milestoneId/review', authenticate, reviewMilestone);

module.exports = router;