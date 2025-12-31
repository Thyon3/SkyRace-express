const Payment = require('../../models/Payment');
const Booking = require('../../models/Booking');
const Flight = require('../../models/Flight');

exports.getRevenueStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            { $match: { status: 'COMPLETED' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 30 }
        ]);

        res.json({ stats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRouteStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight',
                    foreignField: '_id',
                    as: 'flightDetails'
                }
            },
            { $unwind: '$flightDetails' },
            {
                $group: {
                    _id: {
                        origin: '$flightDetails.origin',
                        destination: '$flightDetails.destination'
                    },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { bookings: -1 } },
            { $limit: 10 }
        ]);

        res.json({ stats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAirlineStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight',
                    foreignField: '_id',
                    as: 'flightDetails'
                }
            },
            { $unwind: '$flightDetails' },
            {
                $group: {
                    _id: '$flightDetails.airline',
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        res.json({ stats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

