import { Router, Request, Response } from 'express'
import { getDataJudService } from '../services/datajudService.js'
import { logger } from '../utils/logger.js'

const router = Router()

/**
 * POST /api/config/api-key
 * Set or update API Key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.post('/api-key', (req: Request, res: Response): void => {
  try {
    const { apiKey } = req.body

    if (!apiKey || typeof apiKey !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Invalid API Key format',
      })
      return
    }

    const service = getDataJudService()
    service.setApiKey(apiKey)

    logger.info('API Key updated successfully')

    res.json({
      success: true,
      message: 'API Key configured successfully',
    })
  } catch (error) {
    logger.error('Error setting API Key', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set API Key',
    })
  }
})

/**
 * GET /api/config/cache-stats
 * Get cache statistics
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/cache-stats', (_req: Request, res: Response): void => {
  try {
    const service = getDataJudService()
    const stats = service.getCacheStats()

    res.json({
      success: true,
      data: {
        cacheSize: stats.size,
        validEntries: stats.entries,
        cacheExpiryMs: 5 * 60 * 1000,
      },
    })
  } catch (error) {
    logger.error('Error getting cache stats', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get cache stats',
    })
  }
})

/**
 * POST /api/config/cache-clear
 * Clear cache
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.post('/cache-clear', (_req: Request, res: Response): void => {
  try {
    const service = getDataJudService()
    service.clearCache()

    logger.info('Cache cleared')

    res.json({
      success: true,
      message: 'Cache cleared successfully',
    })
  } catch (error) {
    logger.error('Error clearing cache', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache',
    })
  }
})

export default router

