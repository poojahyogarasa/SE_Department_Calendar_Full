-- L2: Create audit_logs table for tracking event actions
CREATE TABLE IF NOT EXISTS audit_logs (
  log_id       INT          NOT NULL AUTO_INCREMENT,
  actor_id     VARCHAR(100) NOT NULL,
  actor_name   VARCHAR(200) NOT NULL,
  action       ENUM('CREATE','UPDATE','DELETE','APPROVE','REJECT') NOT NULL,
  entity_type  VARCHAR(50)  NOT NULL,
  entity_id    VARCHAR(100) NOT NULL,
  entity_name  VARCHAR(255) NOT NULL,
  diff_summary TEXT         NULL,
  details      JSON         NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  INDEX idx_actor_id    (actor_id),
  INDEX idx_entity_id   (entity_id),
  INDEX idx_created_at  (created_at)
);
