const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    },
    category: {
        type: String,
        enum: ['FLIGHT_ISSUE', 'PAYMENT', 'ACCOUNT', 'REFUND', 'OTHER'],
        default: 'OTHER'
    },
    responses: [{
        senderRole: {
            type: String,
            enum: ['USER', 'ADMIN'],
            required: true
        },
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

supportTicketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
