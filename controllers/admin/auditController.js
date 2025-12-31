const AuditLog = require('../../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, action, resource } = req.query;
        const query = {};

        if (action) query.action = action;
        if (resource) query.resource = resource;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await AuditLog.find(query)
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await AuditLog.countDocuments(query);

        res.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
