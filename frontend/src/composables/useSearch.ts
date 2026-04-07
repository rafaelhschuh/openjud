import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { Processo } from '@/types/api'

export const useSearch = () => {
  const { searchProcesses, loading, error } = useApi()

  const results = ref<Processo[]>([])
  const searchQuery = ref('')
  const filters = ref({
    tribunal: '',
    classe: '',
    assunto: '',
    orgaoJulgador: '',
  })
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalResults = ref(0)

  const hasResults = computed(() => results.value.length > 0)

  const perform = async () => {
    if (!searchQuery.value && !Object.values(filters.value).some(f => f)) {
      return
    }

    const params: Record<string, string | number | undefined> = {
      numeroProcesso: searchQuery.value || undefined,
      ...filters.value,
    }

    results.value = await searchProcesses(params, currentPage.value, pageSize.value)
    totalResults.value = results.value.length
  }

  const clearSearch = () => {
    searchQuery.value = ''
    filters.value = {
      tribunal: '',
      classe: '',
      assunto: '',
      orgaoJulgador: '',
    }
    results.value = []
    totalResults.value = 0
    currentPage.value = 1
  }

  const resetPage = () => {
    currentPage.value = 1
  }

  return {
    results,
    searchQuery,
    filters,
    currentPage,
    pageSize,
    totalResults,
    hasResults,
    loading,
    error,
    perform,
    clearSearch,
    resetPage,
  }
}
