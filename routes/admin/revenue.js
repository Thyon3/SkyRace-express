const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/admin/revenueController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/summary', revenueController.getRevenueStats);
router.get('/routes', revenueController.getRouteStats);
router.get('/airlines', revenueController.getAirlineStats);


module.exports = router;
