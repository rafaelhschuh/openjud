import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Processo } from '@/types/api'
import { useApi } from '@/composables/useApi'

export const useProcessStore = defineStore('processes', () => {
  const { getProcess: fetchProcess } = useApi()

  const currentProcess = ref<Processo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setCurrentProcess = (processo: Processo) => {
    currentProcess.value = processo
  }

  const getProcess = async (id: string): Promise<Processo | null> => {
    loading.value = true
    error.value = null

    try {
      const processo = await fetchProcess(id)
      if (processo) {
        currentProcess.value = processo
      }
      return processo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching process'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearCurrentProcess = () => {
    currentProcess.value = null
    error.value = null
  }

  return {
    currentProcess,
    loading,
    error,
    setCurrentProcess,
    getProcess,
    clearCurrentProcess,
  }
})
