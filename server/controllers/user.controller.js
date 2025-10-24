// In server/src/controllers/user.controller.js
const User = require('../models/user.model.js');

// --- NEW FUNCTION: Search for users ---
const searchUsers = async (req, res) => {
    try {
        const query = req.query.q || ''; // Get the search query (e.g., /api/users/search?q=john)
        const currentUserId = req.user._id; // From the 'authenticate' middleware

        if (!query) {
            return res.status(200).json([]); // Return empty array if no query
        }

        // Find users matching the query in username or fullName.
        // We use $regex for a partial, case-insensitive search.
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude the user who is searching
                {
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        // Assuming you have 'fullName' nested in 'profile'
                        { 'profile.fullName': { $regex: query, $options: 'i' } } 
                    ]
                }
            ]
        }).select('username profile.fullName profile.avatar'); // Only send public info

        res.status(200).json(users);

    } catch (err) {
        console.error('Error in searchUsers:', err);
        res.status(500).send("Error searching for users.");
    }
};

// --- Get a user's public profile information ---
const getUser = async (req, res) => {
    // ... (your existing getUser function)
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
    // 
    // IMPORTANT: Your original file uses 'req.userId', but your
    // authenticate.js middleware sets 'req.user._id'.
    // I'll use 'req.user._id' to match your middleware.
    if (req.params.id !== req.user._id.toString()) {
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

// --- EXPORT THE NEW FUNCTION ---
module.exports = {
    getUser,
    updateUser,
    searchUsers // Add this
};