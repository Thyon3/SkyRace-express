const express = require('express');
const router = express.Router();
const airportController = require('../../controllers/admin/airportController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', airportController.getAllAirports);
router.post('/', airportController.createAirport);
router.put('/:id', airportController.updateAirport);
router.delete('/:id', airportController.deleteAirport);

module.exports = router;
