<template>
  <div class="timeline-container">
    <h2 class="timeline-title">Histórico de Movimentos</h2>

    <div class="timeline">
      <div v-for="(movimento, index) in movimentos" :key="index" class="timeline-item">
        <div class="timeline-marker"></div>

        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="movimento-titulo">{{ movimento.nome }}</h3>
            <time class="movimento-data">{{ formatarData(movimento.dataHora) }}</time>
          </div>

          <div v-if="movimento.orgaoJulgador" class="movimento-orgao">
            <span class="orgao-label">Órgão:</span>
            <span class="orgao-nome">{{ movimento.orgaoJulgador.nomeOrgao }}</span>
          </div>

          <div v-if="movimento.complementosTabelados.length > 0" class="complementos">
            <div v-for="complemento in movimento.complementosTabelados" :key="complemento.codigo" class="complemento-item">
              <span class="complemento-descricao">{{ complemento.descricao }}:</span>
              <span class="complemento-valor">{{ complemento.nome }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Movimento } from '@/types/api'

interface Props {
  movimentos: Movimento[]
}

const props = defineProps<Props>()

const movimentos = computed(() => {
  return [...props.movimentos].reverse()
})

const formatarData = (data: string): string => {
  try {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return data
  }
}
</script>

<style scoped>
.timeline-container {
  margin-top: var(--spacing-2xl);
}

.timeline-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.timeline {
  position: relative;
  padding-left: var(--spacing-xl);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-border);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-lg);
  animation: slideLeft var(--transition-slow) ease-out backwards;
}

.timeline-item:nth-child(1) {
  animation-delay: 0ms;
}

.timeline-item:nth-child(2) {
  animation-delay: 100ms;
}

.timeline-item:nth-child(3) {
  animation-delay: 200ms;
}

.timeline-item:nth-child(n + 4) {
  animation-delay: calc((var(--index, 0) * 100ms));
}

.timeline-marker {
  position: absolute;
  left: -17px;
  top: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--color-accent);
  border: 2px solid var(--color-bg-primary);
  box-shadow: 0 0 0 3px var(--color-border);
  transition: all var(--transition-base);
}

.timeline-item:hover .timeline-marker {
  width: 20px;
  height: 20px;
  left: -20px;
  top: -2px;
  box-shadow: 0 0 0 4px var(--color-bg-primary), 0 0 8px rgba(99, 102, 241, 0.3);
}

.timeline-content {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-base);
}

.timeline-item:hover .timeline-content {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.timeline-header {
  margin-bottom: var(--spacing-sm);
}

.movimento-titulo {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.movimento-data {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  display: block;
}

.movimento-orgao {
  padding: var(--spacing-sm);
  background-color: var(--color-bg-primary);
  border-left: 2px solid var(--color-accent);
  border-radius: var(--radius-sm);
  margin: var(--spacing-md) 0;
  font-size: var(--font-size-sm);
}

.orgao-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.orgao-nome {
  color: var(--color-text-primary);
  margin-left: var(--spacing-sm);
}

.complementos {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.complemento-item {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.complemento-descricao {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.complemento-valor {
  color: var(--color-text-primary);
}
</style>
