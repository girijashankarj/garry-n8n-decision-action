import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DecisionSource } from '@/types/decision.types';
import { MAX_DECISION_TEXT_LENGTH } from '@/common/constants';

interface DecisionIntakeFormProps {
  onSubmit: (text: string, source: DecisionSource) => void;
  isLoading?: boolean;
}

export function DecisionIntakeForm({ onSubmit, isLoading }: DecisionIntakeFormProps) {
  const [text, setText] = useState('');
  const [source, setSource] = useState<DecisionSource>('manual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      onSubmit(text.trim(), source);
    }
  };

  const remainingChars = MAX_DECISION_TEXT_LENGTH - text.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Intake</CardTitle>
        <CardDescription>
          Enter your decision text. The system will analyze it and extract actionable steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Source
            </label>
            <Select value={source} onValueChange={(value) => setSource(value as DecisionSource)}>
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Entry</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="form">Form Submission</SelectItem>
                <SelectItem value="notion">Notion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="decision-text" className="text-sm font-medium">
              Decision Text
            </label>
            <Textarea
              id="decision-text"
              placeholder="e.g., I think we should pause feature X and focus on bug fixing for 2 weeks"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX_DECISION_TEXT_LENGTH}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {text.length} / {MAX_DECISION_TEXT_LENGTH} characters
              </span>
              {remainingChars < 100 && (
                <span className={remainingChars < 0 ? 'text-destructive' : ''}>
                  {remainingChars} remaining
                </span>
              )}
            </div>
          </div>

          <Button type="submit" disabled={!text.trim() || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Analyze Decision'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
