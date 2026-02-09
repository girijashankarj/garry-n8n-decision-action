/**
 * Lightweight browser-compatible structured logger.
 * Replaces Winston to avoid Node.js module externalization in Vite builds.
 */

export type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

declare const __DEV__: boolean | undefined;
declare const __LOG_LEVEL__: string | undefined;

function resolveLogLevel(): LogLevel {
  if (typeof __LOG_LEVEL__ === 'string' && __LOG_LEVEL__) return __LOG_LEVEL__ as LogLevel;
  if (typeof __DEV__ === 'boolean' && __DEV__) return 'debug';
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proc = (globalThis as any).process;
    if (proc && proc.env) {
      if (proc.env.VITE_LOG_LEVEL) return proc.env.VITE_LOG_LEVEL as LogLevel;
      if (proc.env.NODE_ENV !== 'production') return 'debug';
    }
  } catch {
    // process not available in some environments
  }
  return 'info';
}

const currentLevel: LogLevel = resolveLogLevel();

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLevel];
}

function formatMessage(
  level: LogLevel,
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
): Record<string, unknown> {
  return {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(context && { context }),
    ...(fileName && { fileName }),
    ...(functionName && { functionName }),
    ...(payload !== undefined && { payload }),
  };
}

export function logMessage(
  level: LogLevel,
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
) {
  if (!shouldLog(level)) return;

  const entry = formatMessage(level, message, payload, context, fileName, functionName);

  switch (level) {
    case 'error':
      console.error(JSON.stringify(entry));
      break;
    case 'warn':
      console.warn(JSON.stringify(entry));
      break;
    case 'debug':
      console.debug(JSON.stringify(entry));
      break;
    case 'info':
    default:
      console.info(JSON.stringify(entry));
      break;
  }
}

export function loggerInfo(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
) {
  logMessage('info', message, payload, context, fileName, functionName);
}

export function loggerError(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
) {
  logMessage('error', message, payload, context, fileName, functionName);
}

export function loggerWarn(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
) {
  logMessage('warn', message, payload, context, fileName, functionName);
}

export function loggerDebug(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string
) {
  logMessage('debug', message, payload, context, fileName, functionName);
}
