<template>
  <div class="search-view">
    <div class="search-container">
      <SearchForm :loading="loading" @search="handleSearch" @clear="handleClear" />

      <div class="results-section">
        <LoadingSpinner v-if="loading" label="Processando busca..." />

        <div v-else-if="error" class="error-message">
          <p>⚠️ {{ error }}</p>
        </div>

        <div v-else-if="!hasSearched" class="initial-state">
          <div class="initial-content">
            <p class="initial-emoji">🔍</p>
            <h2>Pesquise por processos</h2>
            <p>Utilize os filtros acima para encontrar processos judiciais</p>
            <router-link to="/" class="btn btn-secondary">← Voltar ao Feed</router-link>
          </div>
        </div>

        <div v-else-if="results.length === 0" class="empty-state">
          <p>Nenhum processo encontrado com esses critérios.</p>
          <router-link to="/" class="btn btn-secondary">← Voltar ao Feed</router-link>
        </div>

        <div v-else class="results-container">
          <div class="results-header">
            <h2>Resultados ({{ results.length }} processo{{ results.length !== 1 ? 's' : '' }})</h2>
          </div>

          <div class="results-grid animate-stagger">
            <ProcessCard v-for="processo in results" :key="processo.id" :processo="processo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import SearchForm from '@/components/SearchForm.vue'
import ProcessCard from '@/components/ProcessCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { searchProcesses, loading, error } = useApi()

const results = ref<any[]>([])
const hasSearched = ref(false)

const handleSearch = async (query: Record<string, string>) => {
  hasSearched.value = true
  results.value = await searchProcesses(query)
}

const handleClear = () => {
  results.value = []
  hasSearched.value = false
}
</script>

<style scoped>
.search-view {
  min-height: 100vh;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
}

.search-container {
  max-width: 1280px;
  margin: 0 auto;
}

.results-section {
  margin-top: var(--spacing-2xl);
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  color: #c00;
  text-align: center;
  animation: slideUp var(--transition-base);
}

.initial-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  animation: slideUp var(--transition-slow);
}

.initial-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.initial-emoji {
  font-size: 3rem;
  margin: 0;
}

.initial-state h2,
.empty-state p {
  color: var(--color-text-secondary);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-accent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}

.results-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.results-header h2 {
  margin: 0;
  color: var(--color-text-primary);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .search-view {
    padding: var(--spacing-md);
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>

