/**
 * Shared constants for Garry n8n Decision Action
 */

export const APP_NAME = 'Garry n8n Decision Action';

export const STORAGE_KEYS = {
  MODE: 'garry-n8n-decision-action-mode',
  THEME: 'garry-n8n-decision-action-theme',
  DECISION_DRAFTS: 'garry-n8n-decision-action-drafts',
  DECISION_HISTORY: 'garry-n8n-decision-action-history',
  APPROVAL_REQUESTS: 'garry-n8n-decision-action-approvals',
  AUDIT_LOGS: 'garry-n8n-decision-action-audit-logs',
  USER_PREFERENCES: 'garry-n8n-decision-action-preferences',
} as const;

export const MAX_DECISION_TEXT_LENGTH = 5000;
export const MAX_ACTIONS_PER_DECISION = 20;
export const MAX_AUDIT_LOGS = 1000;
export const APPROVAL_TIMEOUT_HOURS = 24;

export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 75,
  HIGH: 90,
} as const;

export const DECISION_TYPES: Record<string, string> = {
  tech: 'Technical',
  ops: 'Operations',
  business: 'Business',
  people: 'People',
} as const;

export const IMPACT_LEVELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const;

export const URGENCY_LEVELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
} as const;
