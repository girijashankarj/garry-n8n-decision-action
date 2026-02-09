/**
 * Warning messages for user-facing warnings
 */

export const WARN_MESSAGES = {
  HIGH_RISK_DETECTED: 'High risk detected - approval required',
  VAGUE_ACTIONS_DETECTED: 'Some actions are vague and may be rejected',
  MISSING_INFORMATION: 'Missing information may affect risk evaluation',
  APPROVAL_TIMEOUT_WARNING: 'Approval request is approaching timeout',
  PRODUCTION_ENVIRONMENT: 'Production environment detected - extra caution required',
  AFTER_HOURS_EXECUTION: 'After-hours execution detected',
} as const;
