const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.post('/', protect, supportController.createTicket);
router.get('/', protect, supportController.getUserTickets);
router.post('/:id/response', protect, supportController.addResponse);

module.exports = router;
