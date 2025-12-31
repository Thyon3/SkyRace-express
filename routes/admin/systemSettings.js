const express = require('express');
const router = express.Router();
const systemSettingsController = require('../../controllers/admin/systemSettingsController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', systemSettingsController.getAllSettings);
router.patch('/', systemSettingsController.updateSetting);

module.exports = router;
