const PromoCode = require('../models/PromoCode');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.validatePromoCode = async (req, res) => {
    try {
        const { code } = req.body;
        const promo = await PromoCode.findOne({ code, isActive: true });

        if (!promo) {
            return errorResponse(res, 'Invalid promo code', 404);
        }

        if (promo.expiryDate < new Date()) {
            return errorResponse(res, 'Promo code has expired', 400);
        }

        if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
            return errorResponse(res, 'Promo code usage limit reached', 400);
        }

        return successResponse(res, {
            code: promo.code,
            discountType: promo.discountType,
            value: promo.value
        }, 'Promo code is valid');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Admin functionality
exports.createPromoCode = async (req, res) => {
    try {
        const promo = await PromoCode.create(req.body);
        return successResponse(res, promo, 'Promo code created', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.getAllPromos = async (req, res) => {
    try {
        const promos = await PromoCode.find().sort({ createdAt: -1 });
        return successResponse(res, promos, 'Promos retrieved');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

