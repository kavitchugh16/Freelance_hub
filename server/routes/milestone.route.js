console.log("--- milestone.route.js is being read by the server ---"); // Debug marker

const express = require('express');
const router = express.Router();

// ✅ Import controllers safely
const milestoneController = require('../controllers/milestone.controller.js');

// ✅ FIX: Changed the import path to the correct middleware file
const { authenticate } = require('../middlewares/auth.middleware.js');

// ✅ Destructure controller functions
const { submitMilestone, reviewMilestone, getMilestonesForProject } = milestoneController;

// --- Routes ---
router.get('/project/:projectId', authenticate, getMilestonesForProject);
router.patch('/:milestoneId/submit', authenticate, submitMilestone);
router.patch('/:milestoneId/review', authenticate, reviewMilestone);

console.log("--- Milestone routes defined: GET /project/:projectId, PATCH /:milestoneId/... ---");

module.exports = router;