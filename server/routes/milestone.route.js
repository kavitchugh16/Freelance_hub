console.log("--- milestone.route.js is being read by the server ---"); // Debug marker

const express = require('express');
const router = express.Router();

// ✅ Import controllers safely
const milestoneController = require('../controllers/milestone.controller.js');

// ✅ FIX: Destructure authenticate from middlewares
const { authenticate } = require('../middlewares/authenticate.js');

// ✅ Destructure controller functions
const { submitMilestone, reviewMilestone, getMilestonesForProject } = milestoneController;

// --- Routes ---
router.get('/project/:projectId', authenticate, getMilestonesForProject);
router.patch('/:milestoneId/submit', authenticate, submitMilestone);
router.patch('/:milestoneId/review', authenticate, reviewMilestone);

console.log("--- Milestone routes defined: GET /project/:projectId, PATCH /:milestoneId/... ---");

module.exports = router;

