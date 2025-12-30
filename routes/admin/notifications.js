const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/admin/notificationController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', notificationController.getNotifications);
router.post('/broadcast', notificationController.sendBroadcast);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
