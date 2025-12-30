const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/admin/paymentController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/refund', paymentController.processRefund);

module.exports = router;
