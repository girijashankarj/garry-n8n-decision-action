/**
 * Decision Engine Hook
 * Orchestrates the complete decision-to-action workflow
 */

import { useMemo } from 'react';
import type { DecisionWorkflowResult, DecisionInput, DecisionSource } from '@/types/decision.types';
import { intakeDecision } from '@/lib/engine/decision-intake';
import { analyzeDecision } from '@/lib/engine/decision-analysis';
import { extractActions } from '@/lib/engine/action-extraction';
import { evaluateRisk } from '@/lib/engine/risk-evaluation';
import { createAuditLog, saveAuditLog } from '@/lib/engine/audit-logger';
import { loggerDebug } from '@/utils/loggerUtils';

export function useDecisionEngine(
  text: string,
  source: DecisionSource = 'manual',
  userId?: string,
  userName?: string
): DecisionWorkflowResult | null {
  return useMemo(() => {
    if (!text || text.trim().length === 0) {
      return null;
    }

    try {
      // Step 1: Decision Intake
      const decisionInput: DecisionInput = intakeDecision(text, source, userId, userName);
      const decisionId = decisionInput.metadata.sessionId || crypto.randomUUID();

      saveAuditLog(
        createAuditLog(
          'decision-intake',
          { text: decisionInput.text },
          decisionId,
          undefined,
          userId
        )
      );

      // Step 2: Decision Analysis
      const analysis = analyzeDecision(decisionInput.text);
      saveAuditLog(
        createAuditLog('decision-analysis', { analysis }, decisionId, undefined, userId)
      );

      // Step 3: Action Extraction
      const actions = extractActions(decisionInput.text);
      saveAuditLog(
        createAuditLog(
          'action-extraction',
          { actionCount: actions.length },
          decisionId,
          undefined,
          userId
        )
      );

      // Step 4: Risk Evaluation
      const riskEvaluation = evaluateRisk(actions, analysis);
      saveAuditLog(
        createAuditLog(
          'risk-evaluation',
          { riskScore: riskEvaluation.riskScore },
          decisionId,
          undefined,
          userId
        )
      );

      // Determine status based on workflow decision
      let status: DecisionWorkflowResult['status'] = 'completed';
      if (riskEvaluation.workflowDecision === 'block-execution') {
        status = 'blocked';
      } else if (riskEvaluation.workflowDecision === 'require-approval') {
        status = 'awaiting-approval';
      } else if (riskEvaluation.workflowDecision === 'ask-clarification') {
        status = 'analyzing';
      } else if (riskEvaluation.workflowDecision === 'auto-continue') {
        status = 'executing';
      }

      const result: DecisionWorkflowResult = {
        decisionId,
        input: decisionInput,
        analysis,
        actions,
        riskEvaluation,
        executions: [],
        auditLogs: [],
        status,
      };

      loggerDebug(
        'Decision workflow completed',
        { decisionId, status },
        'hooks',
        'use-decision-engine.ts',
        'useDecisionEngine'
      );

      return result;
    } catch (error) {
      loggerDebug(
        'Decision workflow failed',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'hooks',
        'use-decision-engine.ts',
        'useDecisionEngine'
      );

      return {
        decisionId: crypto.randomUUID(),
        input: {
          text,
          metadata: {
            source,
            timestamp: new Date().toISOString(),
          },
        },
        analysis: {
          decisionType: 'business',
          impactLevel: 'low',
          urgency: 'low',
          reversibility: 'reversible',
          confidence: 0,
          reasoning: [],
        },
        actions: [],
        riskEvaluation: {
          environmentRisk: 'local',
          timeRisk: 'normal-hours',
          blastRadius: 0,
          missingInformation: [],
          riskScore: 0,
          workflowDecision: 'block-execution',
          guardrails: [],
        },
        executions: [],
        auditLogs: [],
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, [text, source, userId, userName]);
}
