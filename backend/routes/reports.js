const express = require("express");
const router = express.Router();
const Report = require("../models/Report"); // Changed from Assessment to Report
const mongoose = require("mongoose");

// GET a single generated report by assessmentId
router.get("/:assessmentId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.assessmentId)) {
      return res.status(400).json({ message: "Invalid Assessment ID format." });
    }

    const report = await Report.findOne({
      assessmentId: req.params.assessmentId,
    }).populate("userId", "name email"); // Populate user details

    if (report == null) {
      return res
        .status(404)
        .json({ message: "Report not found for this assessment." });
    }

    res.json(report);
  } catch (err) {
    console.error(
      `Error fetching report for assessment ${req.params.assessmentId}:`,
      err
    );
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
