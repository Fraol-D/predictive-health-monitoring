const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const Recommendation = require("../models/Recommendation");
const mongoose = require("mongoose");

// GET a structured JSON report for a specific assessment
router.get("/:assessmentId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.assessmentId)) {
      return res.status(400).json({ message: "Invalid Assessment ID format." });
    }

    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate("userId") // Populate user data
      .populate("recommendations"); // Populate recommendations, if linked this way in Assessment schema

    if (!assessment) {
      return res.status(404).json({ message: "Assessment report not found" });
    }

    // If recommendations are linked directly to Assessment model via an array of ObjectIds:
    // Make sure the Recommendation model is also populated.
    // If recommendations are fetched separately by assessmentId, then fetch them here:
    const recommendations = await Recommendation.find({
      assessmentId: assessment.assessmentId,
    });

    // Construct a comprehensive report object using the fullAssessmentData
    const report = {
      databaseId: assessment._id, // MongoDB's auto-generated _id
      assessmentId: assessment.assessmentId, // Frontend generated UUID
      userId: assessment.userId ? assessment.userId._id : null, // MongoDB's user _id
      firebaseUID: assessment.userId ? assessment.userId.firebaseUID : null,
      userName: assessment.userId ? assessment.userId.name : null,
      userEmail: assessment.userId ? assessment.userId.email : null,
      date: assessment.createdAt, // Using createdAt from timestamps
      fullAssessmentData: assessment.fullAssessmentData, // The complete frontend data
      riskScores: assessment.riskScores,
      recommendations: recommendations.map((rec) => ({
        id: rec._id, // MongoDB's auto-generated _id for recommendation
        recommendationId: rec.recommendationId, // Frontend generated UUID for recommendation
        category: rec.category,
        advice: rec.advice,
        generatedAt: rec.generatedAt,
      })),
      // TODO: Add other relevant data for the report as needed
    };

    res.json(report);
  } catch (err) {
    console.error("Error fetching assessment report:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
