const SupportTicket = require('../models/SupportTicket');
const { supportTicketSchema, supportResponseSchema } = require('../middleware/validation');

// For Users
exports.createTicket = async (req, res) => {
    try {
        const { error, value } = supportTicketSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const ticket = await SupportTicket.create({
            userId: req.user.id,
            ...value
        });
        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.getUserTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ userId: req.user.id })
            .sort({ updatedAt: -1 });
        res.json({
            success: true,
            data: tickets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// For Admin
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 });
        res.json({
            success: true,
            data: tickets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.addResponse = async (req, res) => {
    try {
        const { error, value } = supportResponseSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { message } = value;

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.responses.push({
            senderRole: req.user.role === 'ADMIN' ? 'ADMIN' : 'USER',
            message
        });

        await ticket.save();

        res.json({
            success: true,
            data: ticket
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.getRecentTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 })
            .limit(5);
        res.json({
            success: true,
            data: tickets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

