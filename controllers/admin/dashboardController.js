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

        // Chart Data (Last 6 Months)
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push({
                month: d.getMonth(),
                year: d.getFullYear(),
                name: d.toLocaleString('default', { month: 'short' })
            });
        }

        const chartData = await Promise.all(months.map(async ({ month, year, name }) => {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);

            const bookings = await Booking.find({
                createdAt: { $gte: start, $lte: end },
                status: 'confirmed'
            });

            const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
            const bookingCount = bookings.length;

            return { name, revenue, bookings: bookingCount };
        }));

        res.json({
            metrics: {
                totalUsers,
                totalBookings,
                totalFlights,
                totalRevenue,
                todayBookings,
                monthlyBookings
            },
            chartData,
            recentBookings: await Booking.find()
                .populate('user', 'name email')
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
