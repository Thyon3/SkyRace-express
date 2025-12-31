const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/admin/paymentController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/refund', paymentController.processRefund);

module.exports = router;
