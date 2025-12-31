const express = require('express');
const router = express.Router();
const airportController = require('../../controllers/admin/airportController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', airportController.getAllAirports);
router.post('/', airportController.createAirport);
router.put('/:id', airportController.updateAirport);
router.delete('/:id', airportController.deleteAirport);

module.exports = router;
