const AuditLog = require('../../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const logs = await AuditLog.find()
            .populate('admin', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });

        const total = await AuditLog.countDocuments();

        res.json({
            logs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
