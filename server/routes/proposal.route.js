const express = require('express');
const router = express.Router();
const proposalCtrl = require('../controllers/proposal.controller');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); // correct import

// -----------------------------
// 🔒 PROTECTED ROUTES
// -----------------------------

// FREELANCER — Create proposal for a project
router.post(
  '/:projectId',
  authenticate,
  restrictTo('freelancer'),
  proposalCtrl.createProposal
);

// CLIENT — Get proposals for a specific project
router.get(
  '/project/:projectId',
  authenticate,
  restrictTo('client'),
  proposalCtrl.getProposalsForProject
);

// FREELANCER — Get all proposals submitted by logged-in freelancer
router.get(
  '/me',
  authenticate,
  restrictTo('freelancer'),
  proposalCtrl.getProposalsByFreelancer
);

module.exports = router;
