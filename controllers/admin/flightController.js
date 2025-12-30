const Flight = require('../../models/Flight');
const { logAdminAction } = require('../../services/admin/auditService');
const { flightCreateSchema } = require('../../middleware/validation');

exports.getAllFlights = async (req, res) => {
    try {
        const { search, status, airline, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { flightNumber: { $regex: search, $options: 'i' } },
                { origin: { $regex: search, $options: 'i' } },
                { destination: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) query.status = status;
        if (airline) query.airline = { $regex: airline, $options: 'i' };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const flights = await Flight.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ departureTime: 1 });

        const total = await Flight.countDocuments(query);

        res.json({
            flights,
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

exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });
        res.json(flight);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createFlight = async (req, res) => {
    try {
        const { error, value } = flightCreateSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const flight = new Flight(value);
        await flight.save();

        await logAdminAction(req.user.id, 'CREATE', 'Flight', flight._id, value);

        res.status(201).json(flight);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        // Validation for update might be partial, but let's use the schema for now or just allow partial updates
        // For strictness, we can validate the body against the schema but allow unknown keys if we want partial updates
        // Or better, just validate what is present. Joi has .validate(data, { abortEarly: false })

        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

        await logAdminAction(req.user.id, 'UPDATE', 'Flight', flight._id, req.body);

        res.json(flight);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

        await logAdminAction(req.user.id, 'DELETE', 'Flight', req.params.id, { flightNumber: flight.flightNumber });

        res.json({ message: 'Flight deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
