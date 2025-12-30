const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profileController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);

module.exports = router;
