const AuditLog = require('../models/AuditLog');

const logAdminAction = async (adminId, action, resource, resourceId = null, details = {}, ipAddress = '') => {
    try {
        const log = new AuditLog({
            admin: adminId,
            action,
            resource,
            resourceId,
            details,
            ipAddress
        });
        await log.save();
    } catch (err) {
        console.error('Failed to save audit log:', err);
    }
};

module.exports = { logAdminAction };
