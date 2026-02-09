/**
 * Info messages for user-facing notifications
 */

export const INFO_MESSAGES = {
  DECISION_RECEIVED: 'Decision received and queued for processing',
  DECISION_ANALYZED: 'Decision analyzed successfully',
  ACTIONS_EXTRACTED: 'Actions extracted from decision',
  RISK_EVALUATED: 'Risk evaluation completed',
  APPROVAL_REQUESTED: 'Approval requested for high-risk actions',
  APPROVAL_GRANTED: 'Approval granted',
  APPROVAL_REJECTED: 'Approval rejected',
  ACTIONS_EXECUTING: 'Actions are being executed',
  ACTIONS_COMPLETED: 'All actions completed successfully',
  DECISION_SAVED: 'Decision saved to history',
  DECISION_RESTORED: 'Decision restored from history',
  AUDIT_LOG_EXPORTED: 'Audit log exported successfully',
} as const;
