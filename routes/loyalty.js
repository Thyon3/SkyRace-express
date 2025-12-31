const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { protect } = require('../middleware/auth');

router.get('/history', protect, loyaltyController.getLoyaltyHistory);

module.exports = router;
