const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");

// GET all notifications for a user by Firebase UID
router.get("/", async (req, res) => {
  try {
    const { userId: firebaseUID } = req.query;

    if (!firebaseUID) {
      return res.status(400).json({ message: "Firebase UID is required" });
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate("relatedRecommendationId")
      .populate("relatedAssessmentId");

        res.json(notifications);
    } catch (err) {
    console.error("Error fetching notifications:", err);
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read by notificationId
router.patch("/", async (req, res) => {
    try {
    const { notificationId, firebaseUID } = req.body;

    if (!notificationId || !firebaseUID) {
      return res
        .status(400)
        .json({ message: "Notification ID and Firebase UID are required" });
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = await Notification.findOne({
      notificationId,
      userId: user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

    res.json({ message: "Notification marked as read" });
    } catch (err) {
    console.error("Error marking notification as read:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 
