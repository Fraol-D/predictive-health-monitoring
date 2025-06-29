const express = require('express');
const router = express.Router();

// GET all notifications for a user
router.get('/user/:userId', (req, res) => {
    res.json({ message: `GET all notifications for user ${req.params.userId}` });
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
    res.json({ message: `Mark notification ${req.params.id} as read` });
});

module.exports = router; 