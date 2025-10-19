// const express = require('express');
// const router = express.Router();
// const { authenticate, restrictTo } = require('../middlewares/authenticate'); 
// const {
//   createProject,
//   getProjects,
//   getMyProjects, // Import the new controller function
//   getProjectById,
//   acceptProposal,
//   getFreelancerProjects
// } = require('../controllers/project.controller.js');

// // --- Main Project Routes ---

// // Get all public projects (for browsing)
// router.get('/', authenticate, getProjects);

// // Get projects for the currently logged-in client
// // This MUST come BEFORE the '/:id' route
// router.get('/my-projects', authenticate, restrictTo('client'), getMyProjects);

// // Get projects for the currently logged-in freelancer
// router.get('/my-freelancer-projects', authenticate, restrictTo('freelancer'), getFreelancerProjects);

// // Get a single project by its ID
// router.get('/:id', authenticate, getProjectById);

// // Create a new project (client only)
// router.post('/', authenticate, restrictTo('client'), createProject);

// // --- Action Routes ---

// // Accept a proposal for a project (client only)
// router.post('/:id/accept-proposal', authenticate, restrictTo('client'), acceptProposal);


// module.exports = router;

const express = require('express');
const router = express.Router();
// ✅ FIX: Changed the import path to the correct middleware file
const { authenticate, restrictTo } = require('../middlewares/auth.middleware.js'); 
const {
  createProject,
  getProjects,
  getMyProjects,
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