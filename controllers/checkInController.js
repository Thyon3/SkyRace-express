const Booking = require('../models/Booking');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const crypto = require('crypto');

exports.performCheckIn = async (req, res) => {
    try {
        const { bookingId, passengerIds } = req.body;

        const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
        if (!booking) {
            return errorResponse(res, 'Booking not found', 404);
        }

        let updated = false;
        booking.passengers.forEach(p => {
            if (passengerIds.includes(p._id.toString()) && !p.isCheckedIn) {
                p.isCheckedIn = true;
                // Generate a mock boarding pass code
                p.boardingPassCode = 'SR-' + crypto.randomBytes(4).toString('hex').toUpperCase();
                updated = true;
            }
        });

        if (!updated) {
            return errorResponse(res, 'No passengers were updated. They might already be checked-in.', 400);
        }

        await booking.save();

        return successResponse(res, booking, 'Check-in successful');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.getBoardingPass = async (req, res) => {
    try {
        const { bookingId, passengerId } = req.params;
        const booking = await Booking.findOne({ _id: bookingId, user: req.user.id })
            .populate('flight');

        if (!booking) {
            return errorResponse(res, 'Booking not found', 404);
        }

        const passenger = booking.passengers.id(passengerId);
        if (!passenger || !passenger.isCheckedIn) {
            return errorResponse(res, 'Passenger not checked in or not found', 400);
        }

        return successResponse(res, {
            passenger,
            flight: booking.flight,
            seats: booking.seats
        }, 'Boarding pass retrieved');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};
