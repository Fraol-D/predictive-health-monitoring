const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// GET all chats for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single chat session
router.get('/:chatId', async (req, res) => {
    try {
        const chat = await Chat.findOne({ chatId: req.params.chatId });
        if (chat == null) {
            return res.status(404).json({ message: 'Cannot find chat' });
        }
        res.json(chat);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// POST a new message to a chat, or create a new chat if it doesn't exist
router.post('/', async (req, res) => {
    const { userId, chatId, title, message } = req.body;

    try {
        let chat = await Chat.findOne({ chatId: chatId, userId: userId });

        if (!chat) {
            chat = new Chat({
                userId,
                chatId,
                title: title || 'New Chat',
                messages: [message]
            });
        } else {
            chat.messages.push(message);
        }

        const updatedChat = await chat.save();
        res.status(201).json(updatedChat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 