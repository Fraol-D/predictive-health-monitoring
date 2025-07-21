const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");

// GET a single report by assessmentId
router.get("/:assessmentId", async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      assessmentId: req.params.assessmentId,
    });
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find report" });
    }
    res.json(assessment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
