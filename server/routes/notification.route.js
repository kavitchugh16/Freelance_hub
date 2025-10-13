// const express = require('express');
// const router = express.Router();
// const Notification = require('../models/Notification');
// const { authenticate } = require('../middlewares/authenticate'); 

// router.get('/', authenticate, async (req, res) => {
//     try {
//         const notifications = await Notification.find({ recipientId: req.user._id })
//             // ✅ CHANGED: Populate now includes the project's status
//             .populate('projectId', 'title status') 
//             .sort({ createdAt: -1 })
//             .limit(20);

//         res.status(200).json({ success: true, notifications });
//     } catch (err) {
//         console.error('❌ getNotifications error:', err);
//         res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
//     }
// });

// router.post('/:id/read', authenticate, async (req, res) => {
//     try {
//         const notification = await Notification.findOneAndUpdate(
//             { _id: req.params.id, recipientId: req.user._id },
//             { isRead: true },
//             { new: true }
//         );

//         if (!notification) {
//             return res.status(404).json({ success: false, message: 'Notification not found or unauthorized.' });
//         }

//         res.status(200).json({ success: true, message: 'Notification marked as read.', notification });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Server error marking notification as read.' });
//     }
// });

// module.exports = router;
// server/routes/notification.route.js
// server/routes/notification.route.js
// server/routes/notification.route.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middlewares/authenticate'); 

router.get('/', authenticate, async (req, res) => {
    try {
        // --- ✅ FINAL VERSION: Simply populates the fields the frontend needs ---
        const notifications = await Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('projectId', 'title status _id') // Fetches the project's details
            .populate({ 
                path: 'proposalId', 
                select: 'bid _id' // Fetches the proposal's bid details and its ID
            });

        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error('❌ getNotifications error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
    }
});

router.post('/:id/read', authenticate, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found or unauthorized.' });
        }

        res.status(200).json({ success: true, message: 'Notification marked as read.', notification });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error marking notification as read.' });
    }
});

module.exports = router;