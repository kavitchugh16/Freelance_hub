import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Handles new user registration
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Note: Password hashing is now handled by the user.model.js pre-save hook
        const newUser = new User({
            username,
            email,
            password,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "User has been created successfully." });

    } catch (err) {
        // Handle duplicate username/email error
        if (err.code === 11000) {
            return res.status(400).json({ message: "Username or email already exists." });
        }
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

// Handles user login
export const login = async (req, res) => {
    try {
        // 1. Find the user by their username
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials." });
        }

        // 2. Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // 3. Create a JWT
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 4. Separate password from user info
        const { password, ...userInfo } = user._doc;

        // 5. Send the token in a secure cookie and user info in the response body
        res.cookie("accessToken", token, {
            httpOnly: true, // Prevents client-side script access
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "strict"
        }).status(200).json({ user: userInfo }); // <-- This matches the frontend expectation

    } catch (err) {
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

// Handles user logout
export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    }).status(200).json({ message: "User has been logged out." });
};