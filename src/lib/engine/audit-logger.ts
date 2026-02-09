/**
 * Audit Logger
 * Logs all events for traceability and compliance
 */

import type { AuditLog } from '@/types/decision.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';
import { MAX_AUDIT_LOGS, STORAGE_KEYS } from '@/common/constants';

export function createAuditLog(
  eventType: AuditLog['eventType'],
  data: Record<string, unknown>,
  decisionId?: string,
  actionId?: string,
  userId?: string,
  metadata?: Record<string, unknown>
): AuditLog {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    eventType,
    decisionId,
    actionId,
    userId,
    data,
    metadata,
  };

  loggerDebug(
    DEBUG_MESSAGES.AUDIT_LOG_CREATED,
    { eventType, decisionId },
    'engine',
    'audit-logger.ts',
    'createAuditLog'
  );

  return log;
}

export function saveAuditLog(log: AuditLog): void {
  try {
    const existingLogs = getAuditLogs();
    const updatedLogs = [log, ...existingLogs].slice(0, MAX_AUDIT_LOGS);
    window.localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));
  } catch (error) {
    loggerDebug('Failed to save audit log', { error }, 'engine', 'audit-logger.ts', 'saveAuditLog');
  }
}

export function getAuditLogs(): AuditLog[] {
  try {
    const logsJson = window.localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return logsJson ? (JSON.parse(logsJson) as AuditLog[]) : [];
  } catch {
    return [];
  }
}

export function getAuditLogsByDecisionId(decisionId: string): AuditLog[] {
  return getAuditLogs().filter((log) => log.decisionId === decisionId);
}

export function exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
  const logs = getAuditLogs();

  if (format === 'json') {
    return JSON.stringify(logs, null, 2);
  }

  // CSV format
  const headers = ['id', 'timestamp', 'eventType', 'decisionId', 'actionId', 'userId', 'data'];
  const rows = logs.map((log) => [
    log.id,
    log.timestamp,
    log.eventType,
    log.decisionId || '',
    log.actionId || '',
    log.userId || '',
    JSON.stringify(log.data),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
