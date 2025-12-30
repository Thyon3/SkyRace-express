const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        // const existingUser = await User.findOne({ email });
        // if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // const user = new User({ name, email, password });
        // await user.save();

        const token = jwt.sign({ id: 'mock_user_id' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: 'mock_user_id', name, email }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // const user = await User.findOne({ email });
        // if (!user || !(await user.comparePassword(password))) {
        //   return res.status(400).json({ message: 'Invalid credentials' });
        // }

        const token = jwt.sign({ id: 'mock_user_id' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.json({
            token,
            user: { id: 'mock_user_id', name: 'John Doe', email }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
