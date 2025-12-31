const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const { protect } = require('../middleware/auth');


// Create Booking
router.post('/', protect, async (req, res) => {

    try {
        const { flightId, passengers, totalPrice, seats } = req.body;

        // 1. Find the flight
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        // 2. Validate seats availability
        if (seats && seats.length > 0) {
            for (const seatNumber of seats) {
                const seat = flight.seats.find(s => s.number === seatNumber);
                if (!seat) {
                    return res.status(400).json({ message: `Seat ${seatNumber} not found` });
                }
                if (seat.isOccupied) {
                    return res.status(400).json({ message: `Seat ${seatNumber} is already occupied` });
                }
            }
        }

        // 3. Create the booking
        const booking = new Booking({
            flight: flightId,
            user: req.user.id,
            passengers,
            seats,
            totalPrice,
            status: 'confirmed'
        });

        await booking.save();

        // 4. Update User Loyalty Points
        const user = await User.findById(req.user.id);
        if (user) {
            const pointsEarned = Math.floor(totalPrice);
            user.loyaltyPoints += pointsEarned;

            // Update Tier
            if (user.loyaltyPoints >= 10000) user.loyaltyTier = 'Platinum';
            else if (user.loyaltyPoints >= 5000) user.loyaltyTier = 'Gold';
            else if (user.loyaltyPoints >= 2000) user.loyaltyTier = 'Silver';

            await user.save();
        }

        // 5. Mark seats as occupied in the Flight document
        if (seats && seats.length > 0) {
            for (const seatNumber of seats) {
                const seatIndex = flight.seats.findIndex(s => s.number === seatNumber);
                if (seatIndex !== -1) {
                    flight.seats[seatIndex].isOccupied = true;
                }
            }
            await flight.save();
        }

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Bookings
router.get('/', protect, async (req, res) => {

    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('flight')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cancel Booking
router.put('/:id/cancel', protect, async (req, res) => {

    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Free up seats
        if (booking.seats && booking.seats.length > 0) {
            const flight = await Flight.findById(booking.flight);
            if (flight) {
                for (const seatNumber of booking.seats) {
                    const seatIndex = flight.seats.findIndex(s => s.number === seatNumber);
                    if (seatIndex !== -1) {
                        flight.seats[seatIndex].isOccupied = false;
                    }
                }
                await flight.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
