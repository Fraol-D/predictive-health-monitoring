const express = require('express');
const router = express.Router();

// Share data for a user
router.post('/user/:userId', (req, res) => {
    res.json({ message: `Share data for user ${req.params.userId}` });
});

// Get PDF report
router.get('/report/:userId', (req, res) => {
    res.json({ message: `Get PDF report for user ${req.params.userId}` });
});

module.exports = router; 