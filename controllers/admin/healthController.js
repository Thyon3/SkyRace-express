const { getSystemHealth } = require('../utils/healthCheck');

const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getHealth = (req, res) => {
    try {
        const health = getSystemHealth();
        return successResponse(res, health);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

