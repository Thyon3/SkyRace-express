const Airline = require('../../models/Airline');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getAllAirlines = async (req, res) => {
    try {
        const airlines = await Airline.find().sort({ name: 1 });
        res.json({ airlines });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAirline = async (req, res) => {
    try {
        const airline = new Airline(req.body);
        await airline.save();
        await logAdminAction(req.user.id, 'CREATE', 'Airline', airline._id, { name: airline.name });
        res.status(201).json(airline);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAirline = async (req, res) => {
    try {
        const airline = await Airline.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!airline) return res.status(404).json({ message: 'Airline not found' });
        await logAdminAction(req.user.id, 'UPDATE', 'Airline', airline._id, req.body);
        res.json(airline);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAirline = async (req, res) => {
    try {
        const airline = await Airline.findByIdAndDelete(req.params.id);
        if (!airline) return res.status(404).json({ message: 'Airline not found' });
        await logAdminAction(req.user.id, 'DELETE', 'Airline', airline._id, { name: airline.name });
        res.json({ message: 'Airline deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
