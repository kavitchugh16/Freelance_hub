// In server/src/controllers/auth.controller.js

const User = require('../models/user.model.js');
const Wallet = require('../models/wallet.model.js');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { username, email, password, role, country, description, skills } = req.body;

        // 1. Hash the password for security
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 2. Create a new user with the data
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            country,
            description,
            // Only add skills if the user is a freelancer
            ...(role === 'freelancer' && { skills })
        });

        // 3. Save the new user to the database
        const savedUser = await newUser.save();

        // 4. Create a corresponding wallet for the new user
        const newUserWallet = new Wallet({
            user: savedUser._id,
            balance: 0 // Wallets always start with a zero balance
        });
        await newUserWallet.save();

        // 5. Send a success response
        res.status(201).send("User has been created successfully and wallet initialized.");

    } catch (err) {
        // Handle errors, such as a duplicate username or email
        if (err.code === 11000) {
            return res.status(400).send("Username or email already exists.");
        }
        res.status(500).send("Something went wrong. Please try again.");
    }
};

module.exports = {
    register
    // We will add the login and logout functions here later
};