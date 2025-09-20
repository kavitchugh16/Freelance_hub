// In server/src/controllers/payment.controller.js

const Wallet = require('../models/wallet.model.js');

const getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.userId });
        if (!wallet) {
            return res.status(404).send("Wallet not found.");
        }
        res.status(200).json(wallet);
    } catch (err) {
        res.status(500).send("Error fetching wallet information.");
    }
};

// This is a placeholder. In a real app, this would be connected to a payment gateway like Stripe.
const depositFunds = async (req, res) => {
    try {
        const { amount } = req.body;

        if (req.userRole !== 'client') {
            return res.status(403).send("Only clients can deposit funds.");
        }

        const wallet = await Wallet.findOneAndUpdate(
            { user: req.userId },
            { 
                $inc: { balance: amount },
                $push: { transactions: { amount, type: 'deposit', description: 'User deposit' } }
            },
            { new: true }
        );
        res.status(200).json(wallet);
    } catch (err) {
        res.status(500).send("Error depositing funds.");
    }
};


module.exports = {
    getWallet,
    depositFunds
};