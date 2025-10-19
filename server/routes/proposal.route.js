// server/routes/proposal.route.js
const express = require('express');
const router = express.Router();
const proposalCtrl = require('../controllers/proposal.controller');
// ✅ FIX: Changed the import path to the correct middleware file
const { authenticate, restrictTo } = require('../middlewares/auth.middleware.js'); 

// Submit a proposal (freelancer only)
router.post('/', authenticate, restrictTo('freelancer'), proposalCtrl.createProposal);

// Get all proposals for a project (client only)
router.get('/project/:projectId', authenticate, restrictTo('client'), proposalCtrl.getProposalsByProject);

// Approve a proposal (client only)
router.post('/:proposalId/approve', authenticate, restrictTo('client'), proposalCtrl.approveProposal);

module.exports = router;