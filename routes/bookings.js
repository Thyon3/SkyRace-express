const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { validate, bookingSchema } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Create a booking
router.post('/', [auth, validate(bookingSchema)], async (req, res) => {
    try {
        const { flightId, passengers, totalPrice } = req.body;

        const booking = new Booking({
            user: req.user._id,
            flight: flightId,
            passengers,
            totalPrice,
            status: 'confirmed'
        });

        await booking.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all bookings for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
