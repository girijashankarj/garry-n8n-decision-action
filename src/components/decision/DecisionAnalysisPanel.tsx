import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import type { DecisionWorkflowResult } from '@/types/decision.types';
import { DECISION_TYPES, IMPACT_LEVELS, URGENCY_LEVELS } from '@/common/constants';

interface DecisionAnalysisPanelProps {
  result: DecisionWorkflowResult;
}

export function DecisionAnalysisPanel({ result }: DecisionAnalysisPanelProps) {
  const { analysis, riskEvaluation } = result;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Decision Analysis</CardTitle>
          <CardDescription>Classification and impact assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Decision Type</label>
              <div className="mt-1">
                <Badge variant="outline">
                  {DECISION_TYPES[analysis.decisionType] || analysis.decisionType}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Impact Level</label>
              <div className="mt-1">
                <RiskBadge
                  level={analysis.impactLevel}
                  label={IMPACT_LEVELS[analysis.impactLevel]}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Urgency</label>
              <div className="mt-1">
                <Badge variant="outline">
                  {URGENCY_LEVELS[analysis.urgency] || analysis.urgency}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reversibility</label>
              <div className="mt-1">
                <Badge variant="outline">{analysis.reversibility}</Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Confidence</label>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysis.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{analysis.confidence}%</span>
              </div>
            </div>
          </div>

          {analysis.reasoning.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reasoning</label>
              <ul className="mt-2 space-y-1">
                {analysis.reasoning.map((reason, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Evaluation</CardTitle>
          <CardDescription>Risk assessment and workflow decision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Environment Risk</label>
              <div className="mt-1">
                <Badge variant="outline">{riskEvaluation.environmentRisk}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Time Risk</label>
              <div className="mt-1">
                <Badge variant="outline">{riskEvaluation.timeRisk}</Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Risk Score</label>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      riskEvaluation.riskScore >= 80
                        ? 'bg-red-500'
                        : riskEvaluation.riskScore >= 60
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${riskEvaluation.riskScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{riskEvaluation.riskScore}/100</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Blast Radius</label>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${riskEvaluation.blastRadius}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{riskEvaluation.blastRadius}%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Workflow Decision</label>
            <div className="mt-1">
              <Badge
                variant={
                  riskEvaluation.workflowDecision === 'block-execution'
                    ? 'destructive'
                    : riskEvaluation.workflowDecision === 'require-approval'
                      ? 'default'
                      : 'secondary'
                }
              >
                {riskEvaluation.workflowDecision.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>

          {riskEvaluation.guardrails.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Guardrails</label>
              <ul className="mt-2 space-y-1">
                {riskEvaluation.guardrails.map((guardrail, idx) => (
                  <li key={idx} className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⚠️ {guardrail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {riskEvaluation.missingInformation.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Missing Information
              </label>
              <ul className="mt-2 space-y-1">
                {riskEvaluation.missingInformation.map((info, idx) => (
                  <li key={idx} className="text-sm text-orange-600 dark:text-orange-400">
                    ⚠️ {info}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
