// // In server/routes/milestone.route.js

// const express = require('express');
// const { submitMilestone, reviewMilestone } = require('../controllers/milestone.controller.js');
// const authenticate = require('../middlewares/authenticate.js');

// const router = express.Router();

// // Protected route for a freelancer to submit a milestone
// router.patch('/:milestoneId/submit', authenticate, submitMilestone);

// // Protected route for a client to approve or request revisions on a milestone
// router.patch('/:milestoneId/review', authenticate, reviewMilestone);

// module.exports = router;

// In server/routes/milestone.route.js
console.log("--- milestone.route.js is being read by the server ---"); // <-- ADD THIS LINE AT THE TOP
const express = require('express');
// ✅ ADDED: Import the new getMilestonesForProject function
const { submitMilestone, reviewMilestone, getMilestonesForProject } = require('../controllers/milestone.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// ✅ ADDED: New route to get all milestones for a specific project
router.get('/project/:projectId', authenticate, getMilestonesForProject);

// Protected route for a freelancer to submit a milestone
router.patch('/:milestoneId/submit', authenticate, submitMilestone);

// Protected route for a client to approve or request revisions on a milestone
router.patch('/:milestoneId/review', authenticate, reviewMilestone);
console.log("--- Milestone routes defined: GET /project/:projectId, etc. ---"); // <-- ADD THIS LINE
module.exports = router;