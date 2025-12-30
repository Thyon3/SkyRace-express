const Booking = require('../../models/Booking');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getAllBookings = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;

        // Note: Searching by user email or name requires aggregation or two-step query because of population
        // For simplicity, let's assume search is for booking ID or we populate first (expensive)
        // Better approach: Find users matching search, then find bookings for those users

        if (search) {
            // Basic search by ID if valid ObjectId
            if (search.match(/^[0-9a-fA-F]{24}$/)) {
                query._id = search;
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('flight')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments(query);

        res.json({
            bookings,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('flight');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        await logAdminAction(req.user.id, 'UPDATE_STATUS', 'Booking', booking._id, { status });

        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        await logAdminAction(req.user.id, 'DELETE', 'Booking', req.params.id, {});

        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
