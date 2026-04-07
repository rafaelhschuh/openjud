import { ref, computed } from 'vue'
import axios, { AxiosInstance } from 'axios'
import { ApiResponse, Processo } from '@/types/api'

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const client: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Local cache em localStorage
const CACHE_KEY_PREFIX = 'openjud_cache_'
const CACHE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutos

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const getCacheKey = (endpoint: string, params?: Record<string, unknown>): string => {
  const paramsStr = params ? JSON.stringify(params) : ''
  return CACHE_KEY_PREFIX + btoa(`${endpoint}:${paramsStr}`)
}

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    if (Date.now() - entry.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

const setCache = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (err) {
    console.warn('Failed to cache data:', err)
  }
}

export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleError = (err: unknown) => {
    let message = 'An error occurred'
    if (axios.isAxiosError(err)) {
      message = err.response?.data?.error || err.message
    } else if (err instanceof Error) {
      message = err.message
    }
    error.value = message
    console.error('API Error:', message)
  }

  const searchProcesses = async (
    params: Record<string, string | number | undefined>,
    page: number = 1,
    limit: number = 20
  ): Promise<Processo[]> => {
    loading.value = true
    error.value = null

    const cacheKey = getCacheKey('/api/processes/search', { ...params, page, limit })
    const cached = getFromCache<Processo[]>(cacheKey)
    if (cached) {
      loading.value = false
      return cached
    }

    try {
      const response = await client.get<ApiResponse<Processo[]>>('/api/processes/search', {
        params: {
          ...params,
          page,
          limit,
        },
      })

      if (response.data.success && response.data.data) {
        setCache(cacheKey, response.data.data)
        return response.data.data
      }

      throw new Error(response.data.error || 'Failed to search processes')
    } catch (err) {
      handleError(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getRecentProcesses = async (limit: number = 20): Promise<Processo[]> => {
    loading.value = true
    error.value = null

    const cacheKey = getCacheKey('/api/processes/recent', { limit })
    const cached = getFromCache<Processo[]>(cacheKey)
    if (cached) {
      loading.value = false
      return cached
    }

    try {
      const response = await client.get<ApiResponse<Processo[]>>('/api/processes/recent', {
        params: { limit },
      })

      if (response.data.success && response.data.data) {
        setCache(cacheKey, response.data.data)
        return response.data.data
      }

      throw new Error(response.data.error || 'Failed to fetch recent processes')
    } catch (err) {
      handleError(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getProcess = async (id: string): Promise<Processo | null> => {
    loading.value = true
    error.value = null

    const cacheKey = getCacheKey(`/api/processes/${id}`)
    const cached = getFromCache<Processo>(cacheKey)
    if (cached) {
      loading.value = false
      return cached
    }

    try {
      const response = await client.get<ApiResponse<Processo>>(`/api/processes/${id}`)

      if (response.data.success && response.data.data) {
        setCache(cacheKey, response.data.data)
        return response.data.data
      }

      throw new Error(response.data.error || 'Failed to fetch process')
    } catch (err) {
      handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const setApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await client.post('/api/config/api-key', { apiKey })
      if (response.data.success) {
        error.value = null
        // Limpar cache ao mudar API Key
        clearCache()
        return true
      }
      throw new Error(response.data.error || 'Failed to set API Key')
    } catch (err) {
      handleError(err)
      return false
    }
  }

  const clearCache = (): void => {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }

  const getCacheStats = async (): Promise<any> => {
    try {
      const response = await client.get('/api/config/cache-stats')
      return response.data.data
    } catch (err) {
      handleError(err)
      return null
    }
  }

  return {
    loading,
    error,
    searchProcesses,
    getRecentProcesses,
    getProcess,
    setApiKey,
    clearCache,
    getCacheStats,
  }
}
