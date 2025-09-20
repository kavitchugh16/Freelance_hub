// In server/src/controllers/auth.controller.js

const User = require('../models/user.model.js');
const Wallet = require('../models/wallet.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            ...(role === 'freelancer' && { skills })
        });

        // 3. Save the new user to the database
        const savedUser = await newUser.save();

        // 4. Create a corresponding wallet for the new user
        const newUserWallet = new Wallet({
            user: savedUser._id,
            balance: 0
        });
        await newUserWallet.save();

        // 5. Send a success response
        res.status(201).send("User has been created successfully and wallet initialized.");

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send("Username or email already exists.");
        }
        res.status(500).send("Something went wrong. Please try again.");
    }
};

const login = async (req, res) => {
    try {
        // 1. Find the user by their username
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).send("User not found!");

        // 2. Compare the provided password with the stored hashed password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(400).send("Wrong username or password!");

        // 3. Create a JWT if the password is correct
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 4. Separate password from user info and send the response
        const { password, ...userInfo } = user._doc;

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }).status(200).json(userInfo);

    } catch (err) {
        res.status(500).send("Something went wrong. Please try again.");
    }
};

const logout = (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    }).status(200).send("User has been logged out.");
};

module.exports = {
    register,
    login,
    logout
};