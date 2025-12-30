const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { validate, bookingSchema } = require('../middleware/validation');

// Create a booking
router.post('/', validate(bookingSchema), async (req, res) => {
    try {
        const { flightId, passengers, totalPrice } = req.body;

        const booking = new Booking({
            flight: flightId, // Assuming flightId is the MongoDB ID
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

// Get all bookings (for a user - mock for now)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
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
