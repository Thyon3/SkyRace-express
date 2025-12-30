const Airport = require('../../models/Airport');
const { logAdminAction } = require('../../services/admin/auditService');
const { airportSchema } = require('../../middleware/validation');

exports.getAllAirports = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { iataCode: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const airports = await Airport.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Airport.countDocuments(query);
        res.json({ airports, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAirport = async (req, res) => {
    try {
        const { error, value } = airportSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const airport = await Airport.create(value);
        await logAdminAction(req.user.id, 'CREATE', 'Airport', airport._id, value);
        res.status(201).json(airport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAirport = async (req, res) => {
    try {
        const { error, value } = airportSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const airport = await Airport.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!airport) return res.status(404).json({ message: 'Airport not found' });
        await logAdminAction(req.user.id, 'UPDATE', 'Airport', airport._id, value);
        res.json(airport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAirport = async (req, res) => {
    try {
        const airport = await Airport.findByIdAndDelete(req.params.id);
        if (!airport) return res.status(404).json({ message: 'Airport not found' });
        await logAdminAction(req.user.id, 'DELETE', 'Airport', req.params.id, { name: airport.name });
        res.json({ message: 'Airport deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
