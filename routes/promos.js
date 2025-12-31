const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const { protect, admin } = require('../middleware/auth');

router.post('/validate', protect, promoController.validatePromoCode);
router.post('/', protect, admin, promoController.createPromoCode);
router.get('/', protect, admin, promoController.getAllPromos);


module.exports = router;
