import express, { Express, Request, Response } from 'express'
import { corsMiddleware } from './middleware/cors.js'
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler.js'
import processesRouter from './routes/processes.js'
import { logger } from './utils/logger.js'

export const createApp = (): Express => {
  const app = express()

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(requestLogger)
  app.use(corsMiddleware)

  // Health check endpoint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'OpenJud Backend is running',
      timestamp: new Date().toISOString(),
    })
  })

  // API Routes
  app.use('/api/processes', processesRouter)

  // 404 Handler
  app.use(notFoundHandler)

  // Error Handler (must be last)
  app.use(errorHandler)

  return app
}

export const startServer = async (): Promise<void> => {
  try {
    const app = createApp()
    const port = parseInt(process.env.PORT || '3001', 10)

    app.listen(port, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://0.0.0.0:${port}`)
      logger.info(`📡 DataJud API: ${process.env.DATAJUD_API_BASE_URL}`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}
