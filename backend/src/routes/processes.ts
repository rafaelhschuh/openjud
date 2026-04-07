import { Router, Request, Response } from 'express'
import { datajudService } from '../services/datajudService.js'
import { logger } from '../utils/logger.js'
import { ApiResponse, SearchParams } from '../types/index.js'

const router = Router()

/**
 * GET /api/processes/search
 * Search for processes
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const params: SearchParams = {
      numeroProcesso: req.query.numeroProcesso as string,
      tribunal: req.query.tribunal as string,
      classe: req.query.classe as string,
      assunto: req.query.assunto as string,
      orgaoJulgador: req.query.orgaoJulgador as string,
      dataAjuizamentoFrom: req.query.dataAjuizamentoFrom as string,
      dataAjuizamentoTo: req.query.dataAjuizamentoTo as string,
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    logger.info('Searching processes', { params, page, limit })

    const processos = await datajudService.searchProcesses(params, page, limit)

    const response: ApiResponse<typeof processos> = {
      success: true,
      data: processos,
    }

    res.json(response)
  } catch (error) {
    logger.error('Error in search endpoint', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search processes',
    })
  }
})

/**
 * GET /api/processes/:id
 * Get process details
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    logger.info(`Fetching process ${id}`)

    const processo = await datajudService.getProcess(id)

    if (!processo) {
      res.status(404).json({
        success: false,
        error: 'Process not found',
      })
      return
    }

    const response: ApiResponse<typeof processo> = {
      success: true,
      data: processo,
    }

    res.json(response)
  } catch (error) {
    logger.error('Error in get process endpoint', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process',
    })
  }
})

export default router
