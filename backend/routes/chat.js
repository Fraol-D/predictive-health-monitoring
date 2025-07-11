const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

// GET all chats for a user
router.get("/user/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    const chats = await Chat.find({ userId: req.params.userId }).sort({
      updatedAt: -1,
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single chat session by chatId (from frontend)
router.get("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId });
    if (chat == null) {
      return res.status(404).json({ message: "Cannot find chat" });
    }
    res.json(chat);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST a new message to a chat, or create a new chat if it doesn't exist
router.post("/", async (req, res) => {
  const { userId, chatId, title, message } = req.body;

  if (!userId || !chatId || !message) {
    return res.status(400).json({
      message: "Missing required chat data (userId, chatId, message).",
      received: {
        userId,
        chatId,
        message: message ? "[present]" : "[missing]",
      },
    });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." });
  }

  try {
    let chat = await Chat.findOne({ userId: userId, chatId: chatId });

    if (!chat) {
      // If chat doesn't exist, create a new one
      const newChat = new Chat({
        userId,
        chatId,
        title: title || `Chat with AI on ${new Date().toLocaleDateString()}`,
        messages: [message],
      });
      const savedChat = await newChat.save();
      res.status(201).json(savedChat);
    } else {
      // If chat exists, append the new message
      chat.messages.push(message);
      const updatedChat = await chat.save();
      res.json(updatedChat);
    }
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({
        message: "Chat with this ID already exists for this user.",
        details: err.message,
      });
    }
    console.error("Error in chat POST route:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a chat session by chatId
router.delete("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ chatId: req.params.chatId });
    if (chat == null) {
      return res.status(404).json({ message: "Cannot find chat to delete." });
    }
    res.json({ message: "Chat deleted successfully." });
  } catch (err) {
    console.error("Error in chat DELETE route:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
