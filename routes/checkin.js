const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const { protect } = require('../middleware/auth');

router.post('/', protect, checkInController.performCheckIn);
router.get('/:bookingId/:passengerId', protect, checkInController.getBoardingPass);

module.exports = router;
