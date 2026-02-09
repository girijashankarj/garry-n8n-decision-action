/**
 * Type definitions for Decision-to-Action Automation System
 */

export type DecisionSource = 'webhook' | 'slack' | 'email' | 'form' | 'notion' | 'manual';

export type DecisionType = 'tech' | 'ops' | 'business' | 'people';

export type ImpactLevel = 'low' | 'medium' | 'high';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type Reversibility = 'reversible' | 'partially-reversible' | 'irreversible';

export type EnvironmentRisk = 'prod' | 'staging' | 'dev' | 'local';

export type TimeRisk = 'normal-hours' | 'after-hours' | 'weekend' | 'holiday';

export type WorkflowDecision =
  | 'auto-continue'
  | 'ask-clarification'
  | 'require-approval'
  | 'block-execution';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'timeout' | 'cancelled';

export type ActionStatus =
  | 'pending'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'rejected';

export interface DecisionMetadata {
  source: DecisionSource;
  userId?: string;
  userName?: string;
  timestamp: string;
  sessionId?: string;
}

export interface DecisionInput {
  text: string;
  metadata: DecisionMetadata;
}

export interface DecisionAnalysis {
  decisionType: DecisionType;
  impactLevel: ImpactLevel;
  urgency: UrgencyLevel;
  reversibility: Reversibility;
  confidence: number; // 0-100
  reasoning: string[];
}

export interface ExtractedAction {
  id: string;
  action: string;
  target?: string;
  timeframe?: string;
  parameters?: Record<string, unknown>;
  isExplicit: boolean;
  confidence: number; // 0-100
}

export interface RiskEvaluation {
  environmentRisk: EnvironmentRisk;
  timeRisk: TimeRisk;
  blastRadius: number; // 0-100
  missingInformation: string[];
  riskScore: number; // 0-100
  workflowDecision: WorkflowDecision;
  guardrails: string[];
}

export interface ApprovalRequest {
  id: string;
  decisionId: string;
  decisionText: string;
  actions: ExtractedAction[];
  riskEvaluation: RiskEvaluation;
  requestedBy: string;
  requestedAt: string;
  approvers: string[];
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  timeoutAt?: string;
}

export interface ActionExecution {
  id: string;
  actionId: string;
  actionType: string;
  status: ActionStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: Record<string, unknown>;
  isIdempotent: boolean;
  canRevert: boolean;
  revertActionId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType:
    | 'decision-intake'
    | 'decision-analysis'
    | 'action-extraction'
    | 'risk-evaluation'
    | 'approval-request'
    | 'approval-response'
    | 'action-execution'
    | 'error';
  decisionId?: string;
  actionId?: string;
  userId?: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface DecisionWorkflowResult {
  decisionId: string;
  input: DecisionInput;
  analysis: DecisionAnalysis;
  actions: ExtractedAction[];
  riskEvaluation: RiskEvaluation;
  approvalRequest?: ApprovalRequest;
  executions: ActionExecution[];
  auditLogs: AuditLog[];
  status:
    | 'intake'
    | 'analyzing'
    | 'extracting-actions'
    | 'evaluating-risk'
    | 'awaiting-approval'
    | 'executing'
    | 'completed'
    | 'blocked'
    | 'failed';
  error?: string;
}
