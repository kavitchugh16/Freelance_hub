const express = require('express');
const router = express.Router();
const projectCtrl = require('../controllers/project.controller');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); // ✅ correct

// Public routes
router.get('/', projectCtrl.getAllProjects);
router.get('/:id', projectCtrl.getProjectById);

// Protected routes
router.post('/', authenticate, restrictTo('client'), projectCtrl.createProject);
router.post('/:id/accept-proposal', authenticate, restrictTo('client'), projectCtrl.acceptProposal);
// Add other routes similarly...

module.exports = router;
