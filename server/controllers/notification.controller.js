// server/controllers/notification.controller.js
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('projectId', 'title status _id')
            .populate({ 
                path: 'proposalId', 
                select: 'bid'
            })
            .lean();

        // --- ✅ FIX: Corrected the data transformation logic ---
        // This now correctly creates the 'proposal' object while also preserving the 'proposalId' string.
        const transformedNotifications = notifications.map(notification => {
            if (notification.proposalId && typeof notification.proposalId === 'object') {
                // 1. Copy the full populated object to a new field named 'proposal' for the frontend UI
                notification.proposal = notification.proposalId;
                // 2. Set 'proposalId' back to just the ID string for API calls
                notification.proposalId = notification.proposal._id.toString();
            }
            return notification;
        });

        res.status(200).json({ success: true, notifications: transformedNotifications });
    } catch (err) {
        console.error('❌ getNotifications error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
    }
};

exports.markAsRead = async (req, res) => {
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
        console.error('❌ Error marking notification as read:', err);
        res.status(500).json({ success: false, message: 'Server error marking notification as read.' });
    }
};