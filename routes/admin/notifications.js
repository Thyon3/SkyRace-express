const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/admin/notificationController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', notificationController.getNotifications);
router.post('/broadcast', notificationController.sendBroadcast);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
