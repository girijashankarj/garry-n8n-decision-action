/**
 * Risk & Guardrail Evaluation Engine
 * Evaluates environment risk, time risk, blast radius, and missing information
 * Decides workflow path: auto-continue, ask clarification, require approval, or block
 */

import type {
  RiskEvaluation,
  EnvironmentRisk,
  TimeRisk,
  WorkflowDecision,
  ExtractedAction,
  DecisionAnalysis,
} from '@/types/decision.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';
import { RISK_THRESHOLDS } from '@/common/constants';

function detectEnvironmentRisk(actions: ExtractedAction[]): EnvironmentRisk {
  const text = actions
    .map((a) => `${a.action} ${a.target || ''}`)
    .join(' ')
    .toLowerCase();

  if (text.includes('production') || text.includes('prod')) return 'prod';
  if (text.includes('staging')) return 'staging';
  if (text.includes('dev') || text.includes('development')) return 'dev';
  return 'local';
}

function detectTimeRisk(): TimeRisk {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  if (day === 0 || day === 6) return 'weekend';
  if (hour < 9 || hour > 17) return 'after-hours';
  return 'normal-hours';
}

function calculateBlastRadius(actions: ExtractedAction[], analysis: DecisionAnalysis): number {
  let radius = 0;

  // Base radius from impact level
  if (analysis.impactLevel === 'high') radius += 40;
  else if (analysis.impactLevel === 'medium') radius += 20;
  else radius += 10;

  // Increase if production
  const envRisk = detectEnvironmentRisk(actions);
  if (envRisk === 'prod') radius += 30;

  // Increase if irreversible
  if (analysis.reversibility === 'irreversible') radius += 20;
  else if (analysis.reversibility === 'partially-reversible') radius += 10;

  // Increase based on number of actions
  radius += Math.min(actions.length * 5, 20);

  return Math.min(radius, 100);
}

function identifyMissingInformation(
  actions: ExtractedAction[],
  analysis: DecisionAnalysis
): string[] {
  const missing: string[] = [];

  for (const action of actions) {
    if (!action.target && detectEnvironmentRisk([action]) === 'prod') {
      missing.push(`Target environment not specified for action: ${action.action}`);
    }
    if (!action.timeframe && analysis.urgency === 'high') {
      missing.push(`Timeframe not specified for urgent action: ${action.action}`);
    }
    if (action.confidence < 70) {
      missing.push(`Low confidence action needs clarification: ${action.action}`);
    }
  }

  if (analysis.reversibility === 'irreversible' && analysis.impactLevel === 'high') {
    missing.push('High-impact irreversible action requires explicit confirmation');
  }

  return missing;
}

function determineWorkflowDecision(
  riskScore: number,
  missingInfo: string[],
  analysis: DecisionAnalysis,
  envRisk: EnvironmentRisk
): WorkflowDecision {
  // Block if critical risk
  if (
    riskScore >= RISK_THRESHOLDS.HIGH &&
    envRisk === 'prod' &&
    analysis.reversibility === 'irreversible'
  ) {
    return 'block-execution';
  }

  // Require approval for high risk
  if (riskScore >= RISK_THRESHOLDS.HIGH) {
    return 'require-approval';
  }

  // Ask clarification if missing info
  if (missingInfo.length > 0 && riskScore >= RISK_THRESHOLDS.MEDIUM) {
    return 'ask-clarification';
  }

  // Auto-continue for low risk
  if (riskScore < RISK_THRESHOLDS.MEDIUM && missingInfo.length === 0) {
    return 'auto-continue';
  }

  // Default to requiring approval for medium risk
  return 'require-approval';
}

function generateGuardrails(
  riskScore: number,
  envRisk: EnvironmentRisk,
  analysis: DecisionAnalysis
): string[] {
  const guardrails: string[] = [];

  if (envRisk === 'prod') {
    guardrails.push('Production environment - extra caution required');
  }

  if (analysis.reversibility === 'irreversible') {
    guardrails.push('Irreversible action - ensure backup/recovery plan exists');
  }

  if (riskScore >= RISK_THRESHOLDS.HIGH) {
    guardrails.push('High risk detected - approval required before execution');
  }

  if (detectTimeRisk() === 'after-hours' || detectTimeRisk() === 'weekend') {
    guardrails.push('After-hours execution - ensure on-call team is available');
  }

  return guardrails;
}

export function evaluateRisk(
  actions: ExtractedAction[],
  analysis: DecisionAnalysis
): RiskEvaluation {
  loggerDebug(
    DEBUG_MESSAGES.RISK_EVALUATION_STARTED,
    { actionCount: actions.length },
    'engine',
    'risk-evaluation.ts',
    'evaluateRisk'
  );

  const environmentRisk = detectEnvironmentRisk(actions);
  const timeRisk = detectTimeRisk();
  const blastRadius = calculateBlastRadius(actions, analysis);
  const missingInformation = identifyMissingInformation(actions, analysis);

  // Calculate overall risk score
  let riskScore = blastRadius;
  if (environmentRisk === 'prod') riskScore += 20;
  if (timeRisk === 'after-hours' || timeRisk === 'weekend') riskScore += 10;
  if (analysis.reversibility === 'irreversible') riskScore += 15;
  riskScore = Math.min(riskScore, 100);

  const workflowDecision = determineWorkflowDecision(
    riskScore,
    missingInformation,
    analysis,
    environmentRisk
  );
  const guardrails = generateGuardrails(riskScore, environmentRisk, analysis);

  const evaluation: RiskEvaluation = {
    environmentRisk,
    timeRisk,
    blastRadius,
    missingInformation,
    riskScore,
    workflowDecision,
    guardrails,
  };

  loggerDebug(
    DEBUG_MESSAGES.RISK_EVALUATION_COMPLETED,
    { riskScore, workflowDecision },
    'engine',
    'risk-evaluation.ts',
    'evaluateRisk'
  );

  return evaluation;
}
