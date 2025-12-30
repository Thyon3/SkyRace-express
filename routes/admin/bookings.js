const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/admin/bookingController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
