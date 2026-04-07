import { ref } from 'vue'
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

    try {
      const response = await client.get<ApiResponse<Processo[]>>('/api/processes/search', {
        params: {
          ...params,
          page,
          limit,
        },
      })

      if (response.data.success && response.data.data) {
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

  const getProcess = async (id: string): Promise<Processo | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await client.get<ApiResponse<Processo>>(`/api/processes/${id}`)

      if (response.data.success && response.data.data) {
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

  return {
    loading,
    error,
    searchProcesses,
    getProcess,
  }
}
