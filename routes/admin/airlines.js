const express = require('express');
const router = express.Router();
const airlineController = require('../../controllers/admin/airlineController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', airlineController.getAllAirlines);
router.post('/', airlineController.createAirline);
router.put('/:id', airlineController.updateAirline);
router.delete('/:id', airlineController.deleteAirline);

module.exports = router;
