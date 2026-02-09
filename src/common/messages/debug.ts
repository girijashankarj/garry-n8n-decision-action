/**
 * Debug messages for development logging
 */

export const DEBUG_MESSAGES = {
  DECISION_INTAKE_STARTED: 'Decision intake started',
  DECISION_INTAKE_COMPLETED: 'Decision intake completed',
  DECISION_ANALYSIS_STARTED: 'Decision analysis started',
  DECISION_ANALYSIS_COMPLETED: 'Decision analysis completed',
  ACTION_EXTRACTION_STARTED: 'Action extraction started',
  ACTION_EXTRACTION_COMPLETED: 'Action extraction completed',
  RISK_EVALUATION_STARTED: 'Risk evaluation started',
  RISK_EVALUATION_COMPLETED: 'Risk evaluation completed',
  APPROVAL_REQUEST_CREATED: 'Approval request created',
  APPROVAL_RESPONSE_RECEIVED: 'Approval response received',
  ACTION_EXECUTION_STARTED: 'Action execution started',
  ACTION_EXECUTION_COMPLETED: 'Action execution completed',
  AUDIT_LOG_CREATED: 'Audit log created',
  STORAGE_READ: 'Storage read operation',
  STORAGE_WRITE: 'Storage write operation',
} as const;
