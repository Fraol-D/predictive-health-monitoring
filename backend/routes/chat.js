const express = require('express');
const router = express.Router();

// GET all chats for a user
router.get('/user/:userId', (req, res) => {
    res.json({ message: `GET all chats for user ${req.params.userId}` });
});

// GET a single chat session
router.get('/:chatId', (req, res) => {
    res.json({ message: `GET chat with id ${req.params.chatId}` });
});

// POST a new message to a chat
router.post('/:chatId/messages', (req, res) => {
    res.json({ message: `POST new message to chat ${req.params.chatId}` });
});

module.exports = router; 