/**
 * Action Extraction Engine
 * Extracts explicit and implied actions from decision text
 * Rejects vague actions that cannot be executed
 */

import type { ExtractedAction } from '@/types/decision.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';
import { MAX_ACTIONS_PER_DECISION } from '@/common/constants';

const ACTION_VERBS = [
  'create',
  'add',
  'deploy',
  'update',
  'modify',
  'change',
  'remove',
  'delete',
  'pause',
  'resume',
  'start',
  'stop',
  'restart',
  'scale',
  'migrate',
  'backup',
  'restore',
  'notify',
  'send',
  'schedule',
  'cancel',
  'approve',
  'reject',
  'assign',
  'transfer',
  'merge',
  'split',
  'copy',
  'move',
  'rename',
];

const VAGUE_ACTIONS = [
  'think about',
  'consider',
  'maybe',
  'possibly',
  'perhaps',
  'explore',
  'look into',
  'investigate',
  'discuss',
  'review',
  'analyze',
];

function extractActionVerbs(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundVerbs: string[] = [];

  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundVerbs.push(verb);
    }
  }

  return [...new Set(foundVerbs)];
}

function isVagueAction(text: string): boolean {
  const lowerText = text.toLowerCase();
  return VAGUE_ACTIONS.some((vague) => lowerText.includes(vague));
}

function extractTarget(text: string): string | undefined {
  // Simple pattern matching for common targets
  const patterns = [
    /(?:to|in|on)\s+(production|staging|dev|development|local)/i,
    /(?:for|on)\s+(\w+\s+feature|\w+\s+service|\w+\s+system)/i,
    /(?:in|on)\s+(\w+\s+environment)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  return undefined;
}

function extractTimeframe(text: string): string | undefined {
  const patterns = [
    /(today|tomorrow|this week|next week|this month|next month)/i,
    /(in\s+\d+\s+(?:hours?|days?|weeks?|months?))/i,
    /(asap|immediately|now|soon)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  return undefined;
}

function calculateActionConfidence(
  action: string,
  isExplicit: boolean,
  hasTarget: boolean,
  hasTimeframe: boolean
): number {
  let confidence = isExplicit ? 80 : 60;

  if (hasTarget) confidence += 10;
  if (hasTimeframe) confidence += 10;

  if (isVagueAction(action)) confidence -= 30;

  return Math.max(0, Math.min(100, confidence));
}

export function extractActions(text: string): ExtractedAction[] {
  loggerDebug(
    DEBUG_MESSAGES.ACTION_EXTRACTION_STARTED,
    { textLength: text.length },
    'engine',
    'action-extraction.ts',
    'extractActions'
  );

  const actions: ExtractedAction[] = [];
  const verbs = extractActionVerbs(text);

  if (verbs.length === 0) {
    // Try to extract implied actions from sentence structure
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    for (const sentence of sentences) {
      if (sentence.trim().length > 10 && !isVagueAction(sentence)) {
        actions.push({
          id: crypto.randomUUID(),
          action: sentence.trim(),
          isExplicit: false,
          confidence: 50,
        });
      }
    }
  } else {
    for (const verb of verbs) {
      if (isVagueAction(text)) {
        continue; // Skip vague actions
      }

      const target = extractTarget(text);
      const timeframe = extractTimeframe(text);
      const isExplicit = text.toLowerCase().includes(verb);
      const confidence = calculateActionConfidence(verb, isExplicit, !!target, !!timeframe);

      if (confidence < 50) {
        continue; // Skip low-confidence actions
      }

      actions.push({
        id: crypto.randomUUID(),
        action: verb,
        target,
        timeframe,
        isExplicit,
        confidence,
      });
    }
  }

  // Limit number of actions
  const limitedActions = actions.slice(0, MAX_ACTIONS_PER_DECISION);

  loggerDebug(
    DEBUG_MESSAGES.ACTION_EXTRACTION_COMPLETED,
    { actionCount: limitedActions.length },
    'engine',
    'action-extraction.ts',
    'extractActions'
  );

  return limitedActions;
}
