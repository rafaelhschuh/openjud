<template>
  <div class="process-card hover-lift">
    <div class="card-header">
      <div class="tribunal-badge">{{ processo.tribunal }}</div>
      <div class="grau-badge">{{ getGrauLabel(processo.grau) }}</div>
    </div>

    <div class="card-body">
      <p class="numero-processo">{{ formatarNumeroProcesso(processo.numeroProcesso) }}</p>

      <div class="info-row">
        <span class="info-label">Classe:</span>
        <span class="info-value">{{ processo.classe.nome }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Órgão Julgador:</span>
        <span class="info-value">{{ processo.orgaoJulgador.nome }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Data de Ajuizamento:</span>
        <span class="info-value">{{ formatarData(processo.dataAjuizamento) }}</span>
      </div>

      <div v-if="processo.assuntos.length > 0" class="assuntos">
        <div class="assuntos-label">Assuntos:</div>
        <div class="assuntos-list">
          <span v-for="assunto in processo.assuntos.slice(0, 3)" :key="assunto.codigo" class="assunto-tag">
            {{ assunto.nome }}
          </span>
          <span v-if="processo.assuntos.length > 3" class="assunto-tag assunto-more">
            +{{ processo.assuntos.length - 3 }} mais
          </span>
        </div>
      </div>

      <div class="movimento-preview" v-if="processo.movimentos.length > 0">
        <span class="movimento-label">Último movimento:</span>
        <p class="movimento-texto">{{ processo.movimentos[processo.movimentos.length - 1].nome }}</p>
        <span class="movimento-data">{{
          formatarData(processo.movimentos[processo.movimentos.length - 1].dataHora)
        }}</span>
      </div>
    </div>

    <div class="card-footer">
      <router-link :to="`/processo/${processo.id}`" class="btn-view">Ver Detalhes →</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Processo } from '@/types/api'
import { useRouter } from 'vue-router'

defineProps<{
  processo: Processo
}>()

const router = useRouter()

const formatarNumeroProcesso = (numero: string): string => {
  // Format: NNNNNNNNNNNNNNNNNNN -> NNNNNNN-NN.NNNN.N.NN.NNNN
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
    return new Date(data).toLocaleDateString('pt-BR')
  } catch {
    return data
  }
}

const getGrauLabel = (grau: string): string => {
  const graus: Record<string, string> = {
    G1: '1º Grau',
    G2: '2º Grau',
    JE: 'Juizado Especial',
    ST: 'Superior',
  }
  return graus[grau] || grau
}
</script>

<style scoped>
.process-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-slow) ease-out;
}

.process-card:hover {
  border-color: var(--color-accent);
}

.card-header {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tribunal-badge,
.grau-badge {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  background-color: var(--color-accent);
  color: white;
}

.card-body {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.numero-processo {
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-accent);
  margin: 0;
}

.info-row {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.info-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 120px;
}

.info-value {
  color: var(--color-text-primary);
  flex: 1;
}

.assuntos-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.assuntos-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.assunto-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.assunto-more {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.movimento-preview {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-accent);
}

.movimento-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.movimento-texto {
  margin: var(--spacing-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.movimento-data {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.card-footer {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
}

.btn-view {
  color: var(--color-accent);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-view:hover {
  color: var(--color-accent-light);
}
</style>
