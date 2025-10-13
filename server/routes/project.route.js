// const express = require('express');
// const router = express.Router();
// const { authenticate, restrictTo } = require('../middlewares/authenticate'); 
// const {
//   createProject,
//   getProjects,
//   getProjectById,
//   acceptProposal,
//   getFreelancerProjects
// } = require('../controllers/project.controller.js');

// console.log('--- project.route.js loaded ---');
// console.log('typeof authenticate:', typeof authenticate);
// console.log('typeof createProject:', typeof createProject);
// console.log('typeof getProjects:', typeof getProjects);
// console.log('typeof getProjectById:', typeof getProjectById);

// // Project routes
// router.post('/', authenticate, restrictTo('client'), createProject);
// router.get('/', authenticate, getProjects);
// router.get('/:id', authenticate, getProjectById);

// // Extra routes
// router.post('/:id/accept-proposal', authenticate, restrictTo('client'), acceptProposal);
// router.get('/freelancer', authenticate, restrictTo('freelancer'), getFreelancerProjects);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 
const {
  createProject,
  getProjects,
  getMyProjects, // Import the new controller function
  getProjectById,
  acceptProposal,
  getFreelancerProjects
} = require('../controllers/project.controller.js');

// --- Main Project Routes ---

// Get all public projects (for browsing)
router.get('/', authenticate, getProjects);

// Get projects for the currently logged-in client
// This MUST come BEFORE the '/:id' route
router.get('/my-projects', authenticate, restrictTo('client'), getMyProjects);

// Get projects for the currently logged-in freelancer
router.get('/my-freelancer-projects', authenticate, restrictTo('freelancer'), getFreelancerProjects);

// Get a single project by its ID
router.get('/:id', authenticate, getProjectById);

// Create a new project (client only)
router.post('/', authenticate, restrictTo('client'), createProject);

// --- Action Routes ---

// Accept a proposal for a project (client only)
router.post('/:id/accept-proposal', authenticate, restrictTo('client'), acceptProposal);


module.exports = router;
