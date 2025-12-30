const Payment = require('../../models/Payment');
const Booking = require('../../models/Booking');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getAllPayments = async (req, res) => {
    try {
        const { status, method, search } = req.query;
        const query = {};

        if (status) query.status = status;
        if (method) query.paymentMethod = method;
        if (search) query.transactionId = { $regex: search, $options: 'i' };

        const payments = await Payment.find(query)
            .populate('user', 'name email')
            .populate('booking', 'bookingId')
            .sort({ createdAt: -1 });

        res.json({ payments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('user', 'name email')
            .populate('booking');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.processRefund = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        if (payment.status === 'REFUNDED') return res.status(400).json({ message: 'Already refunded' });

        payment.status = 'REFUNDED';
        payment.refundDetails = {
            refundId: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            reason: req.body.reason || 'Admin initiated refund',
            refundedAt: new Date()
        };

        await payment.save();

        // Update booking status if needed
        await Booking.findByIdAndUpdate(payment.booking, { status: 'CANCELLED' });

        await logAdminAction(req.user.id, 'REFUND', 'Payment', payment._id, {
            amount: payment.amount,
            transactionId: payment.transactionId
        });

        res.json({ message: 'Refund processed successfully', payment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
