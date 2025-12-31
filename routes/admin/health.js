const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/admin/healthController');
const { protect, admin } = require('../../middleware/auth');

router.get('/', protect, admin, healthController.getHealth);

module.exports = router;
