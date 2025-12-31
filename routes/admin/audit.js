const express = require('express');
const router = express.Router();
const auditController = require('../../controllers/admin/auditController');
const { protect, admin } = require('../../middleware/auth');

router.get('/', protect, admin, auditController.getAuditLogs);

module.exports = router;
