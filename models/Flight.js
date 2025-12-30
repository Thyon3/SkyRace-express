const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: {
        type: String,
        required: true,
    },
    flightNumber: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    isDirect: {
        type: Boolean,
        default: true,
    },
    fareRules: {
        type: String,
        default: 'Standard fare rules apply. Changes may incur a fee.',
    },
    refundPolicy: {
        type: String,
        default: 'Refundable within 24 hours of booking.',
    },
    seats: [{
        number: String,
        type: { type: String, enum: ['economy', 'business', 'first'], default: 'economy' },
        isOccupied: { type: Boolean, default: false },
        price: { type: Number, default: 0 }
    }],
    status: {
        type: String,
        enum: ['On Time', 'Delayed', 'Cancelled', 'Departed', 'Arrived'],
        default: 'On Time'
    },
    gate: {
        type: String,
        default: 'TBD'
    },
    terminal: {
        type: String,
        default: '1'
    }
});

module.exports = mongoose.model('Flight', flightSchema);
