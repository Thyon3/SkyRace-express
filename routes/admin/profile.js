const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profileController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);

module.exports = router;
