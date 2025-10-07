const express = require('express');
const router = express.Router();
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 
const {
  createProject,
  getProjects,
  getProjectById,
  acceptProposal,
  getFreelancerProjects
} = require('../controllers/project.controller.js');

console.log('--- project.route.js loaded ---');
console.log('typeof authenticate:', typeof authenticate);
console.log('typeof createProject:', typeof createProject);
console.log('typeof getProjects:', typeof getProjects);
console.log('typeof getProjectById:', typeof getProjectById);

// Project routes
router.post('/', authenticate, restrictTo('client'), createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);

// Extra routes
router.post('/:id/accept-proposal', authenticate, restrictTo('client'), acceptProposal);
router.get('/freelancer', authenticate, restrictTo('freelancer'), getFreelancerProjects);

module.exports = router;
