const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/user-growth', dashboardController.getUserGrowth);
router.get('/booking-trends', dashboardController.getBookingTrends);

module.exports = router;
