const express = require('express');
const router = express.Router();

const auditController = require('../controllers/auditController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// POST /api/audit — log an audit entry (any authenticated user)
router.post('/', verifyToken, auditController.logAudit);

// GET /api/audit — retrieve logs (ADMIN / HOD only)
router.get('/', verifyToken, authorizeRoles('ADMIN', 'HOD'), auditController.getAuditLogs);

module.exports = router;
