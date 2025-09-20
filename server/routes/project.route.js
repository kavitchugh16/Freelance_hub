// In server/src/routes/project.route.js

const express = require('express');
const { createProject, getProjects, getProjectById, acceptBid } = require('../controllers/project.controller.js'); 
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes (require authentication)
router.post('/', authenticate, createProject);
router.patch('/:projectId/accept/:bidId', authenticate, acceptBid);

module.exports = router;