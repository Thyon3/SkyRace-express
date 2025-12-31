const AuditLog = require('../models/AuditLog');
const logger = require('./logger');

const logAction = async (userId, action, entity, entityId, details = {}, ipAddress = 'unknown') => {
    try {
        await AuditLog.create({
            userId,
            action,
            entity,
            entityId,
            details,
            ipAddress
        });
        logger.info(`Audit Log: ${action} on ${entity} (${entityId}) by user ${userId}`);
    } catch (err) {
        logger.error('Failed to create audit log', err);
    }
};

module.exports = {
    logAction
};
