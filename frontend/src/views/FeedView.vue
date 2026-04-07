<template>
  <div class="feed-view">
    <div class="feed-container">
      <!-- Feed Header -->
      <div class="feed-header">
        <h1>📰 Feed de Processos</h1>
        <p class="feed-subtitle">Processos judiciais mais recentes</p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" label="Carregando processos recentes..." />

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p>⚠️ {{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="processes.length === 0" class="empty-state">
        <p>Nenhum processo encontrado no momento</p>
      </div>

      <!-- Feed Posts -->
      <div v-else class="feed-posts animate-stagger">
        <div v-for="(processo, index) in processes" :key="processo.id" class="post" :style="{ '--index': index }">
          <div class="post-header">
            <div class="post-info">
              <span class="tribunal-badge">{{ processo.tribunal }}</span>
              <span class="date">{{ formatarData(processo.dataAjuizamento) }}</span>
            </div>
            <router-link :to="`/processo/${processo.id}`" class="post-link">→</router-link>
          </div>

          <div class="post-content">
            <h2 class="numero">{{ formatarNumeroProcesso(processo.numeroProcesso) }}</h2>

            <div class="meta-info">
              <div class="meta-item">
                <span class="label">Classe:</span>
                <span class="value">{{ processo.classe.nome }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Órgão:</span>
                <span class="value">{{ processo.orgaoJulgador.nome }}</span>
              </div>
            </div>

            <div v-if="processo.assuntos.length > 0" class="assuntos">
              <span v-for="assunto in processo.assuntos.slice(0, 3)" :key="assunto.codigo" class="tag">
                {{ assunto.nome }}
              </span>
              <span v-if="processo.assuntos.length > 3" class="tag tag-more">
                +{{ processo.assuntos.length - 3 }}
              </span>
            </div>

            <div v-if="processo.movimentos.length > 0" class="ultimo-movimento">
              <span class="label">Último movimento:</span>
              <p class="movimento-texto">{{ processo.movimentos[processo.movimentos.length - 1].nome }}</p>
              <span class="movimento-data">
                {{ formatarData(processo.movimentos[processo.movimentos.length - 1].dataHora) }}
              </span>
            </div>
          </div>

          <div class="post-footer">
            <router-link :to="`/processo/${processo.id}`" class="btn-view-details">
              Ver Detalhes →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { Processo } from '@/types/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { getRecentProcesses, loading, error } = useApi()

const processes = ref<Processo[]>([])

onMounted(async () => {
  processes.value = await getRecentProcesses(15)
})

const formatarNumeroProcesso = (numero: string): string => {
  if (numero.length === 20) {
    return `${numero.slice(0, 7)}-${numero.slice(7, 9)}.${numero.slice(9, 13)}.${numero.slice(
      13,
      14
    )}.${numero.slice(14, 16)}.${numero.slice(16, 20)}`
  }
  return numero
}

const formatarData = (data: string): string => {
  try {
    const date = new Date(data)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }

    return date.toLocaleDateString('pt-BR')
  } catch {
    return data
  }
}
</script>

<style scoped>
.feed-view {
  min-height: 100vh;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
}

.feed-container {
  max-width: 700px;
  margin: 0 auto;
}

.feed-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.feed-header h1 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-3xl);
}

.feed-subtitle {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
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

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  animation: slideUp var(--transition-slow);
}

.feed-posts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.post {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  animation: slideUp var(--transition-slow) ease-out backwards;
  animation-delay: calc(var(--index, 0) * 50ms);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.post:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
}

.post-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.tribunal-badge {
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  background-color: var(--color-accent);
  color: white;
}

.date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.post-link {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  font-size: var(--font-size-lg);
  transition: color var(--transition-fast);
}

.post-link:hover {
  color: var(--color-accent-light);
}

.post-content {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.numero {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-accent);
  font-family: 'Courier New', monospace;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.meta-item {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.label {
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 80px;
}

.value {
  color: var(--color-text-primary);
  flex: 1;
}

.assuntos {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.tag:hover {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.tag-more {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.ultimo-movimento {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-accent);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.movimento-texto {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.movimento-data {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.post-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
}

.btn-view-details {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn-view-details:hover {
  color: var(--color-accent-light);
  gap: var(--spacing-sm);
}

@media (max-width: 640px) {
  .feed-view {
    padding: var(--spacing-md);
  }

  .feed-header h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
