// In server/routes/payment.route.js

const express = require('express');
const { getWallet, depositFunds } = require('../controllers/payment.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

// Protected route to get the logged-in user's wallet
router.get('/wallet', authenticate, getWallet);

// Protected route for a client to deposit funds (simulation)
router.post('/wallet/deposit', authenticate, depositFunds);

module.exports = router;