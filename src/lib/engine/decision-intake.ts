/**
 * Decision Intake Engine
 * Normalizes input from various sources and enriches with metadata
 */

import type { DecisionInput, DecisionMetadata, DecisionSource } from '@/types/decision.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';
import { MAX_DECISION_TEXT_LENGTH } from '@/common/constants';

export function normalizeDecisionText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function enrichMetadata(
  _text: string,
  source: DecisionSource,
  userId?: string,
  userName?: string
): DecisionMetadata {
  return {
    source,
    userId,
    userName,
    timestamp: new Date().toISOString(),
    sessionId: crypto.randomUUID(),
  };
}

export function validateDecisionInput(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Decision text cannot be empty' };
  }

  if (text.length > MAX_DECISION_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Decision text exceeds maximum length of ${MAX_DECISION_TEXT_LENGTH} characters`,
    };
  }

  return { valid: true };
}

export function intakeDecision(
  text: string,
  source: DecisionSource,
  userId?: string,
  userName?: string
): DecisionInput {
  loggerDebug(
    DEBUG_MESSAGES.DECISION_INTAKE_STARTED,
    { source, textLength: text.length },
    'engine',
    'decision-intake.ts',
    'intakeDecision'
  );

  const normalizedText = normalizeDecisionText(text);
  const validation = validateDecisionInput(normalizedText);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const metadata = enrichMetadata(normalizedText, source, userId, userName);

  const decisionInput: DecisionInput = {
    text: normalizedText,
    metadata,
  };

  loggerDebug(
    DEBUG_MESSAGES.DECISION_INTAKE_COMPLETED,
    { decisionId: metadata.sessionId },
    'engine',
    'decision-intake.ts',
    'intakeDecision'
  );

  return decisionInput;
}
