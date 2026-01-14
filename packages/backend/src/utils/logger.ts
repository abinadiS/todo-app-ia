import { config } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

function formatMessage(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const colorCode = colors[level];
  const levelStr = level.toUpperCase().padEnd(5);

  let output = `${colorCode}[${timestamp}] ${levelStr}${colors.reset} ${message}`;

  if (meta) {
    output += `\n${JSON.stringify(meta, null, 2)}`;
  }

  return output;
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (config.isDevelopment) {
      console.log(formatMessage('debug', message, meta));
    }
  },

  info(message: string, meta?: unknown) {
    console.log(formatMessage('info', message, meta));
  },

  warn(message: string, meta?: unknown) {
    console.warn(formatMessage('warn', message, meta));
  },

  error(message: string, meta?: unknown) {
    console.error(formatMessage('error', message, meta));
  },
};
