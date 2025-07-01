const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// GET all assessments for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.params.userId });
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single assessment
router.get('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (assessment == null) {
            return res.status(404).json({ message: 'Cannot find assessment' });
        }
        res.json(assessment);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// POST a new assessment
router.post('/', async (req, res) => {
    const assessment = new Assessment({
        userId: req.body.userId,
        symptoms: req.body.symptoms,
        medicalHistory: req.body.medicalHistory,
        lifestyle: req.body.lifestyle,
        riskScores: req.body.riskScores
    });

    try {
        const newAssessment = await assessment.save();
        res.status(201).json(newAssessment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 