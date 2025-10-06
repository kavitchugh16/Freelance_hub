// server/routes/notification.route.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticate, restrictTo } = require('../middlewares/authenticate'); 

/**
 * @desc Get unread notifications for the recipient (Client or Freelancer)
 * @route GET /api/notifications
 * @access Private (Both)
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id })
            .populate('projectId', 'title') // Get project title
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error('❌ getNotifications error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
    }
});

/**
 * @desc Mark a notification as read
 * @route POST /api/notifications/:id/read
 * @access Private (Recipient)
 */
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