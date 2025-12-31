const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/admin/flightController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.post('/', flightController.createFlight);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.patch('/:id', flightController.updateFlight);
router.delete('/:id', flightController.deleteFlight);

module.exports = router;
