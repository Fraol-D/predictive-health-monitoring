const express = require('express');
const router = express.Router();

// GET all recommendations for a user
router.get('/user/:userId', (req, res) => {
    res.json({ message: `GET all recommendations for user ${req.params.userId}` });
});

module.exports = router; 