const Airport = require('../../models/Airport');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getAllAirports = async (req, res) => {
    try {
        const airports = await Airport.find().sort({ city: 1 });
        res.json({ airports });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAirport = async (req, res) => {
    try {
        const airport = new Airport(req.body);
        await airport.save();
        await logAdminAction(req.user.id, 'CREATE', 'Airport', airport._id, { iataCode: airport.iataCode });
        res.status(201).json(airport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAirport = async (req, res) => {
    try {
        const airport = await Airport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!airport) return res.status(404).json({ message: 'Airport not found' });
        await logAdminAction(req.user.id, 'UPDATE', 'Airport', airport._id, req.body);
        res.json(airport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAirport = async (req, res) => {
    try {
        const airport = await Airport.findByIdAndDelete(req.params.id);
        if (!airport) return res.status(404).json({ message: 'Airport not found' });
        await logAdminAction(req.user.id, 'DELETE', 'Airport', airport._id, { iataCode: airport.iataCode });
        res.json({ message: 'Airport deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
