const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/admin/flightController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.post('/', flightController.createFlight);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.patch('/:id', flightController.updateFlight);
router.delete('/:id', flightController.deleteFlight);

module.exports = router;
