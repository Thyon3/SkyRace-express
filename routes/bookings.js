const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { validate, bookingSchema } = require('../middleware/validation');

// Create a booking
router.post('/', validate(bookingSchema), async (req, res) => {
    try {
        const { flightId, passengers, totalPrice } = req.body;

        // In a real app, validate flight existence and price

        const booking = new Booking({
            flight: flightId,
            passengers,
            totalPrice,
            status: 'confirmed'
        });

        // await booking.save(); // Commented out as we don't have DB connection

        // Return mock success
        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                _id: 'mock_booking_id_' + Date.now(),
                ...req.body,
                status: 'confirmed'
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        // const booking = await Booking.findById(req.params.id).populate('flight');
        // if (!booking) return res.status(404).json({ message: 'Booking not found' });
        // res.json(booking);

        res.json({
            _id: req.params.id,
            flight: {
                airline: 'SkyRace Air',
                flightNumber: 'SK123',
                origin: 'New York (JFK)',
                destination: 'London (LHR)',
                departureTime: new Date().toISOString(),
                arrivalTime: new Date(Date.now() + 7 * 3600000).toISOString(),
            },
            passengers: [{ firstName: 'John', lastName: 'Doe' }],
            totalPrice: 450,
            status: 'confirmed'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
