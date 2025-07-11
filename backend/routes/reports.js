const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const mongoose = require("mongoose");

// GET a single assessment to be used as a "report"
router.get("/:assessmentId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.assessmentId)) {
      return res.status(400).json({ message: "Invalid Assessment ID format." });
    }

    const assessment = await Assessment.findById(
      req.params.assessmentId
    ).populate("userId", "name email"); // Populate user details

    if (assessment == null) {
      return res
        .status(404)
        .json({ message: "Cannot find assessment report." });
    }

    // Return the full assessment object, the frontend will format it as a report
    res.json(assessment);
  } catch (err) {
    console.error(
      `Error fetching assessment report ${req.params.assessmentId}:`,
      err
    );
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
