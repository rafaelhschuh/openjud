export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const currentLogLevel = (process.env.LOG_LEVEL || 'info').toUpperCase() as keyof typeof LogLevel

const levelPriority = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const shouldLog = (level: LogLevel): boolean => {
  return levelPriority[level] >= levelPriority[currentLogLevel] || false
}

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${message}`, data || '')
    }
  },
  info: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.INFO)) {
      console.log(`[${new Date().toISOString()}] [INFO] ${message}`, data || '')
    }
  },
  warn: (message: string, data?: unknown) => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, data || '')
    }
  },
  error: (message: string, error?: unknown) => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, error || '')
    }
  },
}
