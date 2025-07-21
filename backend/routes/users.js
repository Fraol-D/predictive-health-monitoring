const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET a single user by Firebase UID
router.get("/firebase/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET the latest assessment for a user by Firebase UID
router.get("/firebase/:uid/latest-assessment", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assessment = await mongoose
      .model("Assessment")
      .findOne({ userId: user._id })
      .sort({ createdAt: -1 });
    if (!assessment) {
      return res
        .status(404)
        .json({ message: "No assessments found for this user" });
    }
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all assessments for a user by Firebase UID
router.get("/firebase/:uid/assessments", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assessments = await mongoose
      .model("Assessment")
      .find({ userId: user._id })
      .sort({ createdAt: -1 });

    const reportSummaries = assessments.map((assessment) => ({
      assessmentId: assessment.assessmentId,
      createdAt: assessment.createdAt,
      overallRisk: {
        score: assessment.riskScores.overall || 0,
        level:
          assessment.riskScores.overall > 75
            ? "High"
            : assessment.riskScores.overall > 50
            ? "Medium"
            : "Low",
      },
    }));

    res.json(reportSummaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  const user = new User({
    firebaseUID: req.body.firebaseUID,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender,
    profileImage: req.body.profileImage,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a user
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }

    if (req.body.name != null) {
      user.name = req.body.name;
    }
    if (req.body.age != null) {
      user.age = req.body.age;
    }
    if (req.body.gender != null) {
      user.gender = req.body.gender;
    }
    if (req.body.profileImage != null) {
      user.profileImage = req.body.profileImage;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
