import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ExtractedAction } from '@/types/decision.types';

interface ActionListProps {
  actions: ExtractedAction[];
}

export function ActionList({ actions }: ActionListProps) {
  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Actions</CardTitle>
          <CardDescription>No actions extracted from decision</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Actions</CardTitle>
        <CardDescription>
          {actions.length} action{actions.length !== 1 ? 's' : ''} identified
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{action.action}</span>
                    <Badge
                      variant={action.isExplicit ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {action.isExplicit ? 'Explicit' : 'Implied'}
                    </Badge>
                  </div>
                  {action.target && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Target: <span className="font-medium">{action.target}</span>
                    </div>
                  )}
                  {action.timeframe && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Timeframe: <span className="font-medium">{action.timeframe}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">
                    {action.confidence}% confidence
                  </div>
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        action.confidence >= 75
                          ? 'bg-green-500'
                          : action.confidence >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${action.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
