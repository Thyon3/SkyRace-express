const express = require('express');
const router = express.Router();
const airlineController = require('../../controllers/admin/airlineController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', airlineController.getAllAirlines);
router.post('/', airlineController.createAirline);
router.put('/:id', airlineController.updateAirline);
router.delete('/:id', airlineController.deleteAirline);

module.exports = router;
