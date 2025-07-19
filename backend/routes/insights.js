const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');

// POST /api/insights/generate
// Generates a new report and recommendations from an assessment and chat history
router.post('/generate', insightController.generateNewInsights);

module.exports = router; 