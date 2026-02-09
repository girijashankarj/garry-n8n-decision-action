import { Badge } from '@/components/ui/badge';
import type { DecisionWorkflowResult } from '@/types/decision.types';

interface WorkflowStatusProps {
  status: DecisionWorkflowResult['status'];
  error?: string;
}

export function WorkflowStatus({ status, error }: WorkflowStatusProps) {
  const statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    intake: { label: 'Intake', variant: 'outline' },
    analyzing: { label: 'Analyzing', variant: 'default' },
    'extracting-actions': { label: 'Extracting Actions', variant: 'default' },
    'evaluating-risk': { label: 'Evaluating Risk', variant: 'default' },
    'awaiting-approval': { label: 'Awaiting Approval', variant: 'secondary' },
    executing: { label: 'Executing', variant: 'default' },
    completed: { label: 'Completed', variant: 'default' },
    blocked: { label: 'Blocked', variant: 'destructive' },
    failed: { label: 'Failed', variant: 'destructive' },
  };

  const config = statusConfig[status] || { label: status, variant: 'outline' };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant}>{config.label}</Badge>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
