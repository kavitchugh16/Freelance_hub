// In server/src/controllers/user.controller.js

const User = require('../models/user.model.js');

// --- Get a user's public profile information ---
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // .select('-password') excludes the password hash
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Error fetching user data.");
    }
};

// --- Update a user's own profile ---
const updateUser = async (req, res) => {
    // Check if the logged-in user is the one they are trying to update
    if (req.params.id !== req.userId) {
        return res.status(403).send("Forbidden: You can only update your own profile.");
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body // Update with any fields passed in the request body
            },
            { new: true } // This option returns the updated document
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).send("Error updating user data.");
    }
};

module.exports = {
    getUser,
    updateUser
};