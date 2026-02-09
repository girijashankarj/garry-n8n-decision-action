import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner';
import type { RootState, AppDispatch } from './store';
import { toggleTheme } from './store/promptSlice';
import { useDecisionEngine } from './hooks/use-decision-engine';
import { useLocalStorage } from './hooks/use-local-storage';
import { DecisionIntakeForm } from './components/decision/DecisionIntakeForm';
import { DecisionAnalysisPanel } from './components/decision/DecisionAnalysisPanel';
import { ActionList } from './components/decision/ActionList';
import { WorkflowStatus } from './components/decision/WorkflowStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import type { DecisionSource } from './types/decision.types';
import { STORAGE_KEYS } from './common/constants';
import { INFO_MESSAGES } from './common/messages/info';
import { ERROR_MESSAGES } from './common/messages/error';
import { loggerDebug } from './utils/loggerUtils';
import { DEBUG_MESSAGES } from './common/messages/debug';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.prompt.theme);
  const [decisionText, setDecisionText] = useState('');
  const [decisionSource, setDecisionSource] = useState<DecisionSource>('manual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionHistory, setDecisionHistory] = useLocalStorage<string[]>(
    STORAGE_KEYS.DECISION_HISTORY,
    []
  );

  const workflowResult = useDecisionEngine(decisionText, decisionSource);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleDecisionSubmit = useCallback(
    (text: string, source: DecisionSource) => {
      setIsProcessing(true);
      setDecisionText(text);
      setDecisionSource(source);
      loggerDebug(
        DEBUG_MESSAGES.DECISION_INTAKE_STARTED,
        { textLength: text.length, source },
        'App',
        'App.tsx',
        'handleDecisionSubmit'
      );

      // Reset processing after a short delay to allow the hook to process
      setTimeout(() => {
        setIsProcessing(false);
        if (workflowResult && workflowResult.status !== 'failed') {
          toast.success(INFO_MESSAGES.DECISION_ANALYZED);
          setDecisionHistory((prev) => [text, ...prev].slice(0, 10));
        } else if (workflowResult?.error) {
          toast.error(ERROR_MESSAGES.ANALYSIS_FAILED);
        }
      }, 500);
    },
    [workflowResult, setDecisionHistory]
  );

  const handleClear = useCallback(() => {
    setDecisionText('');
    setDecisionSource('manual');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Garry n8n Decision Action</h1>
            <p className="text-sm text-muted-foreground">Decision-to-Action Automation System</p>
          </div>
          <Button onClick={handleToggleTheme} variant="outline" size="sm">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </Button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <div className="space-y-6">
          <DecisionIntakeForm onSubmit={handleDecisionSubmit} isLoading={isProcessing} />

          {workflowResult && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Workflow Result</h2>
                <div className="flex items-center gap-2">
                  <WorkflowStatus status={workflowResult.status} error={workflowResult.error} />
                  <Button onClick={handleClear} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Original Decision</CardTitle>
                      <CardDescription>Input text and metadata</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Source
                          </label>
                          <div className="mt-1">
                            <span className="text-sm">{workflowResult.input.metadata.source}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Timestamp
                          </label>
                          <div className="mt-1">
                            <span className="text-sm">
                              {new Date(workflowResult.input.metadata.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Decision Text
                          </label>
                          <div className="mt-1 p-3 bg-muted rounded-md">
                            <p className="text-sm whitespace-pre-wrap">
                              {workflowResult.input.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <DecisionAnalysisPanel result={workflowResult} />
                </div>

                <div className="space-y-6">
                  <ActionList actions={workflowResult.actions} />

                  {workflowResult.status === 'awaiting-approval' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Approval Required</CardTitle>
                        <CardDescription>
                          This decision requires approval before execution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          High-risk actions detected. Please review the risk evaluation and actions
                          before approving.
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button variant="default">Approve</Button>
                          <Button variant="outline">Reject</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {workflowResult.status === 'blocked' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Execution Blocked</CardTitle>
                        <CardDescription>
                          This decision cannot be executed due to high risk
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-destructive">
                          The decision has been blocked due to critical risk factors. Please review
                          the risk evaluation and modify the decision before resubmitting.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}

          {decisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Decisions</CardTitle>
                <CardDescription>Your decision history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {decisionHistory.slice(0, 5).map((text, idx) => (
                    <div
                      key={idx}
                      className="p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setDecisionText(text)}
                    >
                      <p className="text-sm line-clamp-2">{text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Garry n8n Decision Action — Decision-to-Action Automation System</p>
        </div>
      </footer>

      <Toaster position="bottom-right" theme={theme} richColors />
    </div>
  );
}
