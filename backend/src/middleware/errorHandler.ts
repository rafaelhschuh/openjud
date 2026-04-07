import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', err)

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
  })

  next()
}
