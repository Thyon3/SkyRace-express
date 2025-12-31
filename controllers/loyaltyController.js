const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const User = require('../models/User');

exports.getLoyaltyHistory = async (req, res) => {
    try {
        const transactions = await LoyaltyTransaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.addPoints = async (userId, points, description, reference = null) => {
    try {
        await LoyaltyTransaction.create({
            user: userId,
            type: 'EARNED',
            points,
            description,
            reference
        });

        const user = await User.findById(userId);
        user.loyaltyPoints += points;

        // Tier upgrade logic
        if (user.loyaltyPoints >= 20000) user.loyaltyTier = 'Platinum';
        else if (user.loyaltyPoints >= 10000) user.loyaltyTier = 'Gold';
        else if (user.loyaltyPoints >= 5000) user.loyaltyTier = 'Silver';

        await user.save();
    } catch (err) {
        console.error('Failed to add loyalty points:', err);
    }
};
