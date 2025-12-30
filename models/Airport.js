const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iataCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        minlength: 3,
        maxlength: 3
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    timezone: String,
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Airport', airportSchema);
