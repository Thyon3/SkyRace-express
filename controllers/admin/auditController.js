const AuditLog = require('../../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const { action, resource, adminId, page = 1, limit = 20 } = req.query;
        const query = {};

        if (action) query.action = action;
        if (resource) query.resource = resource;
        if (adminId) query.admin = adminId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await AuditLog.find(query)
            .populate('admin', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ timestamp: -1 });

        const total = await AuditLog.countDocuments(query);

        res.json({
            logs,
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
