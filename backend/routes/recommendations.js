const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');

// GET all recommendations for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ userId: req.params.userId }).sort({ generatedAt: -1 });
        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 