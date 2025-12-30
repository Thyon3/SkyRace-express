const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Search flights
router.get('/search', async (req, res) => {
    try {
        const { from, to, date } = req.query;

        let query = {};
        if (from) query.origin = new RegExp(from, 'i');
        if (to) query.destination = new RegExp(to, 'i');

        // In a real app, we'd also filter by date
        // For this demo, we'll return all matching flights or some mock ones if DB is empty
        let flights = await Flight.find(query);

        if (flights.length === 0) {
            // Return some mock data if database is empty to keep the app functional
            flights = [
                {
                    _id: '507f1f77bcf86cd799439011',
                    airline: 'SkyRace Air',
                    flightNumber: 'SK101',
                    origin: from || 'New York (JFK)',
                    destination: to || 'London (LHR)',
                    departureTime: new Date(Date.now() + 86400000),
                    arrivalTime: new Date(Date.now() + 86400000 + 7 * 3600000),
                    price: 450,
                    currency: 'USD'
                },
                {
                    _id: '507f1f77bcf86cd799439012',
                    airline: 'SkyRace Air',
                    flightNumber: 'SK102',
                    origin: from || 'New York (JFK)',
                    destination: to || 'Paris (CDG)',
                    departureTime: new Date(Date.now() + 172800000),
                    arrivalTime: new Date(Date.now() + 172800000 + 8 * 3600000),
                    price: 520,
                    currency: 'USD'
                }
            ];
        }

        res.json(flights);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
