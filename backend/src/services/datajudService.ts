import axios, { AxiosInstance } from 'axios'
import { logger } from '../utils/logger.js'
import { Processo, SearchParams, SearchResponse } from '../types/index.js'

export class DataJudService {
  private client: AxiosInstance

  constructor(baseURL: string = 'https://api-publica.datajud.cnj.jus.br/') {
    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.DATAJUD_API_TIMEOUT || '30000', 10),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    logger.debug('DataJudService initialized', { baseURL })
  }

  /**
   * Search for processes by various criteria
   */
  async searchProcesses(params: SearchParams, page: number = 1, limit: number = 20): Promise<Processo[]> {
    try {
      const query = this.buildQuery(params, page, limit)
      logger.debug('Searching processes', { query })

      const response = await this.client.get<SearchResponse>('/api_publica_processual/processos/search', {
        params: { q: query },
      })

      if (response.data.hits?.hits) {
        const processos = response.data.hits.hits.map((hit) => hit._source)
        logger.info(`Found ${processos.length} processes`)
        return processos
      }

      return []
    } catch (error) {
      logger.error('Error searching processes', error)
      throw new Error('Failed to search processes')
    }
  }

  /**
   * Get a specific process by ID
   */
  async getProcess(id: string): Promise<Processo | null> {
    try {
      logger.debug('Fetching process', { id })

      const response = await this.client.get<{ _source: Processo }>(
        `/api_publica_processual/processos/${id}`
      )

      if (response.data._source) {
        logger.info(`Process fetched: ${id}`)
        return response.data._source
      }

      return null
    } catch (error) {
      logger.error('Error fetching process', error)
      throw new Error('Failed to fetch process')
    }
  }

  /**
   * Build query string for DataJud API
   */
  private buildQuery(params: SearchParams, page: number, limit: number): string {
    const queries: string[] = []

    if (params.numeroProcesso) {
      queries.push(`numeroProcesso:${params.numeroProcesso}`)
    }

    if (params.tribunal) {
      queries.push(`tribunal:${params.tribunal}`)
    }

    if (params.classe) {
      queries.push(`classe.codigo:${params.classe}`)
    }

    if (params.assunto) {
      queries.push(`assuntos.codigo:${params.assunto}`)
    }

    if (params.orgaoJulgador) {
      queries.push(`orgaoJulgador.codigo:${params.orgaoJulgador}`)
    }

    if (params.dataAjuizamentoFrom || params.dataAjuizamentoTo) {
      let dateRange = 'dataAjuizamento:['
      dateRange += params.dataAjuizamentoFrom || '*'
      dateRange += ' TO '
      dateRange += params.dataAjuizamentoTo || '*'
      dateRange += ']'
      queries.push(dateRange)
    }

    const query = queries.join(' AND ')
    const from = (page - 1) * limit

    return `${query || '*'}&from=${from}&size=${limit}`
  }

  /**
   * Get available tribunals
   */
  async getTribunals(): Promise<string[]> {
    try {
      logger.debug('Fetching tribunals')
      // This would need to be implemented based on DataJud API documentation
      // For now, return a hardcoded list of common Brazilian courts
      return [
        'STF',
        'STJ',
        'TST',
        'TJSP',
        'TJMG',
        'TJRJ',
        'TJBA',
        'TJRS',
        'TJPR',
        'TJSC',
        'TJES',
        'TJDF',
        'TJPB',
        'TJCE',
        'TJPE',
        'TJMT',
        'TJGO',
        'TJMS',
        'TJRR',
        'TJRO',
        'TJAM',
        'TJAP',
        'TJTO',
        'TJAC',
      ]
    } catch (error) {
      logger.error('Error fetching tribunals', error)
      throw new Error('Failed to fetch tribunals')
    }
  }
}

export const datajudService = new DataJudService()
