const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET all notifications for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification == null) {
            return res.status(404).json({ message: 'Cannot find notification' });
        }
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 