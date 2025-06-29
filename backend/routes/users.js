const express = require('express');
const router = express.Router();

// Placeholder for user routes

// GET all users
router.get('/', (req, res) => {
    res.json({ message: 'GET all users' });
});

// GET a single user
router.get('/:id', (req, res) => {
    res.json({ message: `GET user with id ${req.params.id}` });
});

// POST a new user
router.post('/', (req, res) => {
    res.json({ message: 'POST a new user' });
});

// DELETE a user
router.delete('/:id', (req, res) => {
    res.json({ message: `DELETE user with id ${req.params.id}` });
});

// UPDATE a user
router.patch('/:id', (req, res) => {
    res.json({ message: `UPDATE user with id ${req.params.id}` });
});


module.exports = router; 