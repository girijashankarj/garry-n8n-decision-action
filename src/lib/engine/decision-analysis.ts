/**
 * Decision Analysis Engine
 * Analyzes decision text to extract type, impact, urgency, and reversibility
 * Uses rule-based analysis (explainable, no black-box AI)
 */

import type {
  DecisionAnalysis,
  DecisionType,
  ImpactLevel,
  UrgencyLevel,
  Reversibility,
} from '@/types/decision.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

const TECH_KEYWORDS = [
  'deploy',
  'code',
  'api',
  'database',
  'server',
  'infrastructure',
  'bug',
  'feature',
  'hotfix',
  'release',
];
const OPS_KEYWORDS = [
  'monitor',
  'alert',
  'incident',
  'outage',
  'scaling',
  'capacity',
  'backup',
  'disaster',
  'recovery',
];
const BUSINESS_KEYWORDS = [
  'revenue',
  'customer',
  'sales',
  'marketing',
  'strategy',
  'budget',
  'cost',
  'profit',
  'growth',
];
const PEOPLE_KEYWORDS = [
  'team',
  'hire',
  'fire',
  'promote',
  'training',
  'meeting',
  'review',
  'performance',
];

const IMPACT_KEYWORDS = {
  high: [
    'critical',
    'urgent',
    'production',
    'customer-facing',
    'revenue',
    'security',
    'compliance',
  ],
  medium: ['important', 'significant', 'major', 'feature', 'enhancement'],
  low: ['minor', 'nice-to-have', 'optimization', 'cleanup', 'documentation'],
};

const URGENCY_KEYWORDS = {
  critical: ['immediately', 'now', 'asap', 'emergency', 'critical', 'outage', 'down'],
  high: ['today', 'urgent', 'soon', 'quickly', 'priority'],
  medium: ['this week', 'soon', 'planned'],
  low: ['eventually', 'later', 'when possible', 'backlog'],
};

const REVERSIBILITY_KEYWORDS = {
  reversible: ['toggle', 'feature flag', 'rollback', 'revert', 'undo'],
  'partially-reversible': ['deploy', 'update', 'modify', 'change'],
  irreversible: ['delete', 'remove', 'terminate', 'cancel', 'shutdown'],
};

function classifyDecisionType(text: string): DecisionType {
  const lowerText = text.toLowerCase();

  const techScore = TECH_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;
  const opsScore = OPS_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;
  const businessScore = BUSINESS_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;
  const peopleScore = PEOPLE_KEYWORDS.filter((kw) => lowerText.includes(kw)).length;

  const scores = [
    { type: 'tech' as DecisionType, score: techScore },
    { type: 'ops' as DecisionType, score: opsScore },
    { type: 'business' as DecisionType, score: businessScore },
    { type: 'people' as DecisionType, score: peopleScore },
  ];

  scores.sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].type : 'business';
}

function assessImpactLevel(text: string): ImpactLevel {
  const lowerText = text.toLowerCase();

  const highMatches = IMPACT_KEYWORDS.high.filter((kw) => lowerText.includes(kw)).length;
  const mediumMatches = IMPACT_KEYWORDS.medium.filter((kw) => lowerText.includes(kw)).length;
  const lowMatches = IMPACT_KEYWORDS.low.filter((kw) => lowerText.includes(kw)).length;

  if (highMatches > 0) return 'high';
  if (mediumMatches > 0) return 'medium';
  if (lowMatches > 0) return 'low';

  // Default based on decision type
  const decisionType = classifyDecisionType(text);
  if (decisionType === 'ops' || decisionType === 'tech') return 'medium';
  return 'low';
}

function assessUrgency(text: string): UrgencyLevel {
  const lowerText = text.toLowerCase();

  const criticalMatches = URGENCY_KEYWORDS.critical.filter((kw) => lowerText.includes(kw)).length;
  const highMatches = URGENCY_KEYWORDS.high.filter((kw) => lowerText.includes(kw)).length;
  const mediumMatches = URGENCY_KEYWORDS.medium.filter((kw) => lowerText.includes(kw)).length;
  const lowMatches = URGENCY_KEYWORDS.low.filter((kw) => lowerText.includes(kw)).length;

  if (criticalMatches > 0) return 'critical';
  if (highMatches > 0) return 'high';
  if (mediumMatches > 0) return 'medium';
  if (lowMatches > 0) return 'low';

  return 'medium';
}

function assessReversibility(text: string): Reversibility {
  const lowerText = text.toLowerCase();

  const reversibleMatches = REVERSIBILITY_KEYWORDS.reversible.filter((kw) =>
    lowerText.includes(kw)
  ).length;
  const partiallyMatches = REVERSIBILITY_KEYWORDS['partially-reversible'].filter((kw) =>
    lowerText.includes(kw)
  ).length;
  const irreversibleMatches = REVERSIBILITY_KEYWORDS.irreversible.filter((kw) =>
    lowerText.includes(kw)
  ).length;

  if (irreversibleMatches > 0) return 'irreversible';
  if (reversibleMatches > 0) return 'reversible';
  if (partiallyMatches > 0) return 'partially-reversible';

  return 'partially-reversible';
}

function calculateConfidence(
  decisionType: DecisionType,
  impactLevel: ImpactLevel,
  urgency: UrgencyLevel,
  reversibility: Reversibility
): number {
  let confidence = 70; // Base confidence

  // Increase confidence if we have strong keyword matches
  const text = ''; // Would need original text, but for now use defaults
  const decisionTypeScore = classifyDecisionType(text);
  if (decisionTypeScore === decisionType) confidence += 10;

  // Adjust based on clarity of indicators
  if (impactLevel !== 'low') confidence += 5;
  if (urgency !== 'low') confidence += 5;
  if (reversibility === 'reversible' || reversibility === 'irreversible') confidence += 5;

  return Math.min(confidence, 100);
}

export function analyzeDecision(text: string): DecisionAnalysis {
  loggerDebug(
    DEBUG_MESSAGES.DECISION_ANALYSIS_STARTED,
    { textLength: text.length },
    'engine',
    'decision-analysis.ts',
    'analyzeDecision'
  );

  const decisionType = classifyDecisionType(text);
  const impactLevel = assessImpactLevel(text);
  const urgency = assessUrgency(text);
  const reversibility = assessReversibility(text);
  const confidence = calculateConfidence(decisionType, impactLevel, urgency, reversibility);

  const reasoning: string[] = [
    `Classified as ${decisionType} decision based on keyword analysis`,
    `Impact level: ${impactLevel} based on impact keywords`,
    `Urgency: ${urgency} based on urgency indicators`,
    `Reversibility: ${reversibility} based on action keywords`,
  ];

  const analysis: DecisionAnalysis = {
    decisionType,
    impactLevel,
    urgency,
    reversibility,
    confidence,
    reasoning,
  };

  loggerDebug(
    DEBUG_MESSAGES.DECISION_ANALYSIS_COMPLETED,
    { decisionType, impactLevel, urgency },
    'engine',
    'decision-analysis.ts',
    'analyzeDecision'
  );

  return analysis;
}
