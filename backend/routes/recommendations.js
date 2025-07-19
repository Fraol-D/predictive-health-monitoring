const express = require("express");
const router = express.Router();
const Recommendation = require("../models/Recommendation");
const mongoose = require("mongoose");

// GET all recommendations for a user
router.get("/user/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    const recommendations = await Recommendation.find({
      userId: req.params.userId,
    }).sort({ generatedAt: -1 });
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new recommendation
router.post("/", async (req, res) => {
  const { userId, assessmentId, recommendationId, category, advice } = req.body;

  // Basic validation
  if (!userId || !assessmentId || !recommendationId || !category || !advice) {
    return res
      .status(400)
      .json({ message: "Missing required recommendation data." });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." });
  }
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    return res.status(400).json({ message: "Invalid assessmentId format." });
  }

  try {
    const newRecommendation = new Recommendation({
      userId,
      assessmentId,
      recommendationId,
      category,
      advice,
    });
    const savedRecommendation = await newRecommendation.save();
    res.status(201).json(savedRecommendation);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(409)
        .json({
          message: "Recommendation with this ID already exists.",
          details: err.message,
        });
    }
    console.error("Error in recommendation POST route:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
