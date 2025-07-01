const express = require('express');
const router = express.Router();
const SharedData = require('../models/SharedData');
const { generateHealthReportPDF } = require('../utils/pdfGenerator');

// Share data for a user
router.post('/user/:userId', async (req, res) => {
    const { assessmentIds, consentGiven } = req.body;
    try {
        const newSharedData = new SharedData({
            userId: req.params.userId,
            assessmentIds,
            consentGiven
        });
        const savedData = await newSharedData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get PDF report
router.get('/report/:userId', async (req, res) => {
    try {
        // This is a placeholder for now.
        // In the future, you would find the relevant shared data and generate a PDF.
        const pdfBuffer = await generateHealthReportPDF(req.params.userId);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=health_report_${req.params.userId}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 