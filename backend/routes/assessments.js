const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const mongoose = require("mongoose");

// GET all assessments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    // Validate userId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    const assessments = await Assessment.find({ userId: req.params.userId });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single assessment by its database _id
router.get("/:id", async (req, res) => {
  try {
    // Validate ID as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Assessment ID format." });
    }
    const assessment = await Assessment.findById(req.params.id);
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find assessment" });
    }
    res.json(assessment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET a single assessment by its frontend-generated assessmentId (UUID)
router.get("/byAssessmentId/:assessmentId", async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      assessmentId: req.params.assessmentId,
    });
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find assessment" });
    }
    res.json(assessment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST a new assessment or update an existing one
router.post("/", async (req, res) => {
  const { userId, assessmentId, fullAssessmentData, riskScores } = req.body;

  // Basic validation
  if (!userId || !assessmentId || !fullAssessmentData || !riskScores) {
    return res
      .status(400)
      .json({ message: "Missing required assessment data." });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." });
  }

  try {
    // Check if an assessment with the given assessmentId (from frontend) already exists
    let assessment = await Assessment.findOne({ assessmentId: assessmentId });

    if (assessment) {
      // Update existing assessment
      assessment.fullAssessmentData = fullAssessmentData;
      assessment.riskScores = riskScores;
      assessment.date = Date.now(); // Update date on modification
      const updatedAssessment = await assessment.save();
      res.json(updatedAssessment);
    } else {
      // Create new assessment
      const newAssessment = new Assessment({
        userId,
        assessmentId,
        fullAssessmentData,
        riskScores,
      });
      const savedAssessment = await newAssessment.save();
      res.status(201).json(savedAssessment);
    }
  } catch (err) {
    // Handle validation errors or duplicate key errors (for assessmentId uniqueness)
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(409)
        .json({
          message: "Assessment with this ID already exists.",
          details: err.message,
        });
    }
    res.status(400).json({ message: err.message });
  }
});

// PATCH an assessment to add AI-generated content or update
router.patch("/:id", getAssessment, async (req, res) => {
  // Only allow updating specific fields to prevent overwriting assessment data
  if (req.body.reportSummary != null) {
    res.assessment.reportSummary = req.body.reportSummary;
  }

  try {
    const updatedAssessment = await res.assessment.save();
    res.json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get assessment object by ID
async function getAssessment(req, res, next) {
  try {
    // Validate ID as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Assessment ID format." });
    }
    const assessment = await Assessment.findById(req.params.id);
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find assessment" });
    }
    res.assessment = assessment; // Assign assessment to res.assessment
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
