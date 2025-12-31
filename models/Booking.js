const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    passportNumber: String,
    isCheckedIn: { type: Boolean, default: false },
    boardingPassCode: { type: String },
});


const bookingSchema = new mongoose.Schema({
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    passengers: [passengerSchema],
    seats: [String],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Booking', bookingSchema);
