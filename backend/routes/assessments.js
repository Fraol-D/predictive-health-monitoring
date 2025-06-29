const express = require('express');
const router = express.Router();

// GET all assessments for a user
router.get('/user/:userId', (req, res) => {
    res.json({ message: `GET all assessments for user ${req.params.userId}` });
});

// GET a single assessment
router.get('/:id', (req, res) => {
    res.json({ message: `GET assessment with id ${req.params.id}` });
});

// POST a new assessment
router.post('/', (req, res) => {
    res.json({ message: 'POST a new assessment' });
});

module.exports = router; 