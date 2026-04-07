import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { logger } from '../utils/logger.js'
import { Processo, SearchParams, SearchResponse } from '../types/index.js'

interface CacheEntry {
  data: Processo[]
  timestamp: number
}

export class DataJudService {
  private client: AxiosInstance
  private cache: Map<string, CacheEntry> = new Map()
  private cacheExpiry: number = 5 * 60 * 1000 // 5 minutos

  constructor(
    baseURL: string = 'https://api-publica.datajud.cnj.jus.br/',
    private apiKey?: string
  ) {
    const config: AxiosRequestConfig = {
      baseURL,
      timeout: parseInt(process.env.DATAJUD_API_TIMEOUT || '30000', 10),
      headers: this.getHeaders(),
    }

    this.client = axios.create(config)

    logger.debug('DataJudService initialized', { baseURL, apiKeyConfigured: !!apiKey })
  }

  /**
   * Get request headers with API Key if available
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `APIKey ${this.apiKey}`
    }

    return headers
  }

  /**
   * Set or update API Key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    this.client.defaults.headers.common = this.getHeaders() as any
    this.cache.clear()
    logger.info('API Key updated')
  }

  /**
   * Get cache key for query
   */
  private getCacheKey(params: SearchParams, page: number): string {
    return JSON.stringify({ ...params, page })
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheExpiry
  }

  /**
   * Search for processes by various criteria (with caching)
   */
  async searchProcesses(params: SearchParams, page: number = 1, limit: number = 20): Promise<Processo[]> {
    const cacheKey = this.getCacheKey(params, page)

    const cachedEntry = this.cache.get(cacheKey)
    if (cachedEntry && this.isCacheValid(cachedEntry)) {
      logger.debug('Cache hit for query', { cacheKey })
      return cachedEntry.data
    }

    try {
      const query = this.buildQuery(params, page, limit)
      logger.debug('Searching processes', { query })

      const response = await this.client.get<SearchResponse>('/api_publica_processual/processos/search', {
        params: { q: query },
      })

      if (response.data.hits?.hits) {
        const processos = response.data.hits.hits.map((hit) => hit._source)

        this.cache.set(cacheKey, {
          data: processos,
          timestamp: Date.now(),
        })

        logger.info(`Found ${processos.length} processes (cached for 5 min)`)
        return processos
      }

      return []
    } catch (error) {
      logger.error('Error searching processes', error)
      throw new Error('Failed to search processes')
    }
  }

  /**
   * Get a specific process by ID (with caching)
   */
  async getProcess(id: string): Promise<Processo | null> {
    const cacheKey = `process_${id}`

    const cachedEntry = this.cache.get(cacheKey)
    if (cachedEntry && this.isCacheValid(cachedEntry)) {
      logger.debug('Cache hit for process', { id })
      return cachedEntry.data[0] || null
    }

    try {
      logger.debug('Fetching process', { id })

      const response = await this.client.get<{ _source: Processo }>(
        `/api_publica_processual/processos/${id}`
      )

      if (response.data._source) {
        this.cache.set(cacheKey, {
          data: [response.data._source],
          timestamp: Date.now(),
        })

        logger.info(`Process fetched: ${id} (cached for 5 min)`)
        return response.data._source
      }

      return null
    } catch (error) {
      logger.error('Error fetching process', error)
      throw new Error('Failed to fetch process')
    }
  }

  /**
   * Get recent processes (últimos 30 dias)
   */
  async getRecentProcesses(limit: number = 20): Promise<Processo[]> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dateFrom = thirtyDaysAgo.toISOString().split('T')[0]

    return this.searchProcesses(
      {
        dataAjuizamentoFrom: dateFrom,
      },
      1,
      limit
    )
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; entries: number } {
    let validEntries = 0
    for (const entry of this.cache.values()) {
      if (this.isCacheValid(entry)) {
        validEntries++
      }
    }
    return { size: this.cache.size, entries: validEntries }
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

let datajudService: DataJudService

export function getDataJudService(): DataJudService {
  if (!datajudService) {
    const apiKey = process.env.DATAJUD_API_KEY
    datajudService = new DataJudService(
      process.env.DATAJUD_API_BASE_URL || 'https://api-publica.datajud.cnj.jus.br/',
      apiKey
    )
  }
  return datajudService
}
