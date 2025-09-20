// In server/src/routes/bid.route.js

const express = require('express');
const { createBid, getBidsForProject } = require('../controllers/bid.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Route for a freelancer to place a new bid on a project
// POST /api/bids
router.post('/', authenticate, createBid);

// Route for a client to get all bids for one of their projects
// GET /api/bids/:projectId
router.get('/:projectId', authenticate, getBidsForProject);

module.exports = router;