const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/supportController');
const { protect, admin } = require('../../middleware/auth');

// Using middleware/auth's admin check
router.get('/recent', protect, admin, supportController.getRecentTickets);
router.get('/', protect, admin, supportController.getAllTickets);

router.put('/:id/status', protect, admin, supportController.updateTicketStatus);
router.post('/:id/response', protect, admin, supportController.addResponse);

module.exports = router;
