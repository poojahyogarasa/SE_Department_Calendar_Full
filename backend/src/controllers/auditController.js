const db = require('../config/db');

// =====================================
// 🔹 LOG AUDIT ENTRY (L2)
// =====================================
exports.logAudit = (req, res) => {
  const { actorId, actorName, action, entityType, entityId, entityName, diffSummary, details } = req.body;

  if (!actorId || !action || !entityType || !entityId || !entityName) {
    return res.status(400).json({ message: 'Missing required audit fields' });
  }

  db.query(
    `INSERT INTO audit_logs
     (actor_id, actor_name, action, entity_type, entity_id, entity_name, diff_summary, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      String(actorId),
      actorName || 'Unknown',
      action,
      entityType,
      String(entityId),
      entityName,
      diffSummary || null,
      details ? JSON.stringify(details) : null,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(201).json({ message: 'Audit log recorded' });
    }
  );
};

// =====================================
// 🔹 GET AUDIT LOGS (admin only)
// =====================================
exports.getAuditLogs = (req, res) => {
  const { limit = 100, offset = 0 } = req.query;

  db.query(
    `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [parseInt(limit, 10), parseInt(offset, 10)],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
};
