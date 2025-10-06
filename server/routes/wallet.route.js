// server/routes/wallet.route.js
const express = require('express');
const router = express.Router();
const walletCtrl = require('../controllers/wallet.controller');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 

// Get balance and transactions (Both client and freelancer)
// Renamed from /balance to just /
router.get('/', authenticate, walletCtrl.getWalletDetails); 

// Client-specific actions
router.post('/deposit', authenticate, restrictTo('client'), walletCtrl.depositFunds);

// Freelancer-specific actions
router.post('/withdraw', authenticate, restrictTo('freelancer'), walletCtrl.withdrawFunds);

module.exports = router;