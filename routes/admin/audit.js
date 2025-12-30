const express = require('express');
const router = express.Router();
const auditController = require('../../controllers/admin/auditController');
const { requireAdmin } = require('../../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', auditController.getAuditLogs);

module.exports = router;
