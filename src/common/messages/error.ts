/**
 * Error messages for user-facing error notifications
 */

export const ERROR_MESSAGES = {
  DECISION_TOO_LONG: 'Decision text exceeds maximum length',
  DECISION_EMPTY: 'Decision text cannot be empty',
  ANALYSIS_FAILED: 'Failed to analyze decision',
  ACTION_EXTRACTION_FAILED: 'Failed to extract actions from decision',
  RISK_EVALUATION_FAILED: 'Failed to evaluate risk',
  APPROVAL_FAILED: 'Failed to request approval',
  EXECUTION_FAILED: 'Action execution failed',
  STORAGE_FAILED: 'Failed to save to storage',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded',
  INVALID_DECISION: 'Invalid decision format',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;
