const Airline = require('../../models/Airline');
const { logAdminAction } = require('../../services/admin/auditService');
const { airlineSchema } = require('../../middleware/validation');

exports.getAllAirlines = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { iataCode: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const airlines = await Airline.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Airline.countDocuments(query);
        res.json({ airlines, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAirline = async (req, res) => {
    try {
        const { error, value } = airlineSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const airline = await Airline.create(value);
        await logAdminAction(req.user.id, 'CREATE', 'Airline', airline._id, value);
        res.status(201).json(airline);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAirline = async (req, res) => {
    try {
        const { error, value } = airlineSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const airline = await Airline.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!airline) return res.status(404).json({ message: 'Airline not found' });
        await logAdminAction(req.user.id, 'UPDATE', 'Airline', airline._id, value);
        res.json(airline);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAirline = async (req, res) => {
    try {
        const airline = await Airline.findByIdAndDelete(req.params.id);
        if (!airline) return res.status(404).json({ message: 'Airline not found' });
        await logAdminAction(req.user.id, 'DELETE', 'Airline', req.params.id, { name: airline.name });
        res.json({ message: 'Airline deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
