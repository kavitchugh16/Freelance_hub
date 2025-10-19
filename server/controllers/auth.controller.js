const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// ✅ Import the JWT_SECRET from our new config file
const { JWT_SECRET, NODE_ENV } = require('../config/config.js');

// --- Register Client ---
exports.registerClient = async (req, res) => {
    try {
        const { username, email, password, company, country, description } = req.body;
        const user = new User({ username, email, password, role: 'client', company, country, description });
        await user.save();
        res.status(201).json({ message: 'Client registered successfully' });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Username or email already exists' });
        res.status(500).json({ message: err.message });
    }
};

// --- Register Freelancer ---
exports.registerFreelancer = async (req, res) => {
    try {
        const { username, email, password, skills, portfolio, country, description } = req.body;
        const user = new User({ username, email, password, role: 'freelancer', skills, portfolio, country, description });
        await user.save();
        res.status(201).json({ message: 'Freelancer registered successfully' });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Username or email already exists' });
        res.status(500).json({ message: err.message });
    }
};

// --- Login (Both Roles) ---
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).lean(); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        };

        // ✅ Use the imported JWT_SECRET
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        delete user.password;

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production', // ✅ Use the imported NODE_ENV
            sameSite: 'strict'
        }).status(200).json({ user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// --- Logout ---
exports.logout = (req, res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0)
    }).status(200).json({ message: 'Logged out successfully' });
};