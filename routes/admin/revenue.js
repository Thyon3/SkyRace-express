const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/admin/revenueController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/summary', revenueController.getRevenueStats);
router.get('/routes', revenueController.getRouteStats);

module.exports = router;
