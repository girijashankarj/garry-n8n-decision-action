import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import type { RootState, AppDispatch } from './store';
import { toggleTheme } from './store/promptSlice';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.prompt.theme);

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Garry n8n Decision Action</h1>
          <button
            onClick={handleToggleTheme}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Decision-to-Action Automation System</h2>
          <p className="text-muted-foreground">
            This system converts human decisions (text-based) into safe, auditable, step-by-step actions using n8n workflows.
          </p>
          <div className="mt-8 p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Implementation coming soon. This project is based on the meta prompt specification.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Garry n8n Decision Action — Decision-to-Action Automation System</p>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        theme={theme}
        richColors
      />
    </div>
  );
}
