
// const Wallet = require('../models/wallet.model.js'); // ⚠️ Import the new Wallet model
// const User = require('../models/user.model'); // Import User for role check

// // Helper function to find or create a wallet
// const getOrCreateWallet = async (userId) => {
//     let wallet = await Wallet.findOne({ user: userId });
//     if (!wallet) {
//         wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
//     }
//     return wallet;
// };

// /**
//  * @desc   Client deposits funds (adds transaction and updates balance)
//  * @route POST /api/wallet/deposit
//  * @access Private (Client)
//  */
// exports.depositFunds = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user._id;

//         if (req.user.role !== 'client') {
//             return res.status(403).json({ success: false, message: 'Only clients can deposit funds.' });
//         }
//         if (!amount || amount <= 0 || isNaN(amount)) {
//             return res.status(400).json({ success: false, message: 'Deposit amount must be a positive number.' });
//         }
        
//         const wallet = await getOrCreateWallet(userId);

//         // 1. Update Balance
//         wallet.balance += Number(amount);
        
//         // 2. Record Transaction
//         wallet.transactions.push({
//             amount: Number(amount),
//             type: 'deposit',
//             description: 'Client fund deposit'
//         });

//         await wallet.save();

//         res.status(200).json({ 
//             success: true, 
//             message: `Successfully deposited $${amount}.`,
//             newBalance: wallet.balance 
//         });

//     } catch (err) {
//         console.error('❌ depositFunds error:', err);
//         res.status(500).json({ success: false, message: 'Server error during deposit.' });
//     }
// };

// /**
//  * @desc   Freelancer withdraws funds (adds transaction and updates balance)
//  * @route POST /api/wallet/withdraw
//  * @access Private (Freelancer)
//  */
// exports.withdrawFunds = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user._id;

//         if (req.user.role !== 'freelancer') {
//             return res.status(403).json({ success: false, message: 'Only freelancers can withdraw funds.' });
//         }
//         if (!amount || amount <= 0 || isNaN(amount)) {
//             return res.status(400).json({ success: false, message: 'Withdrawal amount must be a positive number.' });
//         }

//         const wallet = await getOrCreateWallet(userId);

//         if (wallet.balance < amount) {
//             return res.status(400).json({ success: false, message: 'Insufficient funds for withdrawal.' });
//         }

//         // 1. Update Balance
//         wallet.balance -= Number(amount);
        
//         // 2. Record Transaction
//         wallet.transactions.push({
//             amount: -Number(amount), // Store as negative for withdrawal
//             type: 'withdrawal',
//             description: 'Freelancer fund withdrawal'
//         });

//         await wallet.save();

//         res.status(200).json({ 
//             success: true, 
//             message: `Successfully withdrew $${amount}.`,
//             newBalance: wallet.balance 
//         });

//     } catch (err) {
//         console.error('❌ withdrawFunds error:', err);
//         res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
//     }
// };

// /**
//  * @desc   Get wallet details (balance and transactions)
//  * @route GET /api/wallet
//  * @access Private (Both)
//  */
// exports.getWalletDetails = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         // Use getOrCreateWallet to ensure the document exists
//         const wallet = await getOrCreateWallet(userId);

//         // Note: You can optionally limit the number of transactions returned here
//         res.status(200).json({ 
//             success: true, 
//             balance: wallet.balance,
//             transactions: wallet.transactions.sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
//         });

//     } catch (err) {
//         console.error('❌ getWalletDetails error:', err);
//         res.status(500).json({ success: false, message: 'Server error while fetching wallet details.' });
//     }
// };

// server/controllers/wallet.controller.js
const mongoose = require('mongoose');
const Wallet = require('../models/wallet.model.js');
const User = require('../models/user.model.js'); // Assuming this model exists

// Helper function to find or create a wallet
const getOrCreateWallet = async (userId) => {
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
    }
    return wallet;
};

// --- EXISTING FUNCTIONS (depositFunds, withdrawFunds, getWalletDetails) ---
// ... (depositFunds, withdrawFunds, getWalletDetails functions remain unchanged) ...

/**
 * @desc   Client deposits funds (adds transaction and updates balance)
 * @route POST /api/wallet/deposit
 * @access Private (Client)
 */
exports.depositFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        if (req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Only clients can deposit funds.' });
        }
        if (!amount || amount <= 0 || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Deposit amount must be a positive number.' });
        }
        
        const wallet = await getOrCreateWallet(userId);
        wallet.balance += Number(amount);
        wallet.transactions.push({
            amount: Number(amount),
            type: 'deposit',
            description: 'Client fund deposit'
        });
        await wallet.save();
        res.status(200).json({ 
            success: true, 
            message: `Successfully deposited ₹${amount}.`,
            newBalance: wallet.balance 
        });
    } catch (err) {
        console.error('❌ depositFunds error:', err);
        res.status(500).json({ success: false, message: 'Server error during deposit.' });
    }
};

/**
 * @desc   Freelancer withdraws funds (adds transaction and updates balance)
 * @route POST /api/wallet/withdraw
 * @access Private (Freelancer)
 */
exports.withdrawFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Only freelancers can withdraw funds.' });
        }
        if (!amount || amount <= 0 || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Withdrawal amount must be a positive number.' });
        }

        const wallet = await getOrCreateWallet(userId);

        if (wallet.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds for withdrawal.' });
        }
        
        wallet.balance -= Number(amount);
        wallet.transactions.push({
            amount: -Number(amount),
            type: 'withdrawal',
            description: 'Freelancer fund withdrawal'
        });
        await wallet.save();
        res.status(200).json({ 
            success: true, 
            message: `Successfully withdrew ₹${amount}.`,
            newBalance: wallet.balance 
        });
    } catch (err) {
        console.error('❌ withdrawFunds error:', err);
        res.status(500).json({ success: false, message: 'Server error during withdrawal.' });
    }
};

/**
 * @desc   Get wallet details (balance and transactions)
 * @route GET /api/wallet
 * @access Private (Both)
 */
exports.getWalletDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const wallet = await getOrCreateWallet(userId);
        res.status(200).json({ 
            success: true, 
            balance: wallet.balance,
            transactions: wallet.transactions.sort((a, b) => b.timestamp - a.timestamp)
        });
    } catch (err) {
        console.error('❌ getWalletDetails error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching wallet details.' });
    }
};


// --- NEW INTERNAL FUNCTION ---
/**
 * @desc     Processes milestone payment from a client to a freelancer.
 * @access   Internal (called by other controllers, not an API route)
 */
exports.releaseMilestonePayment = async (clientId, freelancerId, amount, milestoneDescription) => {
    // For production, this entire operation should be wrapped in a database transaction
    // to ensure atomicity. If any step fails, all previous steps are rolled back.
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const clientWallet = await Wallet.findOne({ user: clientId }).session(session);
        if (!clientWallet || clientWallet.balance < amount) {
            throw new Error('Client has insufficient funds.');
        }

        const freelancerWallet = await getOrCreateWallet(freelancerId);

        // 1. Debit client's wallet
        clientWallet.balance -= amount;
        clientWallet.transactions.push({
            amount: -amount,
            type: 'milestone_payment_release',
            description: `Payment for: ${milestoneDescription}`
        });
        
        // 2. Credit freelancer's wallet
        // We must find the freelancer's wallet again, but this time lock it with the session
        const freelancerWalletInSession = await Wallet.findOne({ user: freelancerId }).session(session);
        freelancerWalletInSession.balance += amount;
        freelancerWalletInSession.transactions.push({
            amount: amount,
            type: 'milestone_payment_release',
            description: `Payment received for: ${milestoneDescription}`
        });

        // 3. Save both wallets
        await clientWallet.save({ session });
        await freelancerWalletInSession.save({ session });

        // If all operations were successful, commit the transaction
        await session.commitTransaction();
        return { success: true };

    } catch (error) {
        // If any error occurred, abort the transaction
        await session.abortTransaction();
        console.error('Milestone payment transaction failed:', error.message);
        throw error; // Re-throw the error to be handled by the calling function
    } finally {
        // End the session
        session.endSession();
    }
};