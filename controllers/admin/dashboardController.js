const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Flight = require('../../models/Flight');

exports.getDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'USER' });
        const totalBookings = await Booking.countDocuments();
        const totalFlights = await Flight.countDocuments();

        // Revenue calculation
        const bookings = await Booking.find({ status: 'confirmed' });
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // Today's bookings
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Monthly growth (simplified)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.json({
            metrics: {
                totalUsers,
                totalBookings,
                totalFlights,
                totalRevenue,
                todayBookings,
                monthlyBookings
            },
            recentBookings: await Booking.find()
                .populate('user', 'name')
                .populate('flight', 'airline flightNumber')
                .limit(5)
                .sort({ createdAt: -1 })
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserGrowth = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: last30Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ userGrowth });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingTrends = async (req, res) => {
    try {
        const trends = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.json({ trends });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
