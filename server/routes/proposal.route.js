// // server/routes/proposal.route.js
// const express = require('express');
// const router = express.Router();
// const proposalCtrl = require('../controllers/proposal.controller');
// const { authenticate, restrictTo } = require('../middlewares/authenticate'); 

// // 1. Create Proposal (Bid)
// router.post('/', authenticate, restrictTo('freelancer'), proposalCtrl.createProposal);

// // 2. Get proposals for a specific project (Client side)
// router.get('/project/:projectId', authenticate, restrictTo('client'), proposalCtrl.getProposalsByProject);

// // ... add other proposal routes here (e.g., /my-proposals)

// module.exports = router;
// server/routes/proposal.route.js
const express = require('express');
const router = express.Router();
const proposalCtrl = require('../controllers/proposal.controller');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 

router.post('/', authenticate, restrictTo('freelancer'), proposalCtrl.createProposal);
router.get('/project/:projectId', authenticate, restrictTo('client'), proposalCtrl.getProposalsByProject);

// ✅ ADDED: New route to approve a proposal directly from a notification
router.post('/:proposalId/approve', authenticate, restrictTo('client'), proposalCtrl.approveProposal);

module.exports = router;