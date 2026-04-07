<template>
  <div class="process-view">
    <div class="container">
      <router-link to="/" class="back-link">← Voltar</router-link>

      <LoadingSpinner v-if="loading" label="Carregando processo..." />

      <div v-else-if="error" class="error-message">
        <p>⚠️ {{ error }}</p>
      </div>

      <div v-else-if="processo" class="process-detail animate-fade-in">
        <div class="detail-header">
          <div class="header-info">
            <h1>{{ formatarNumeroProcesso(processo.numeroProcesso) }}</h1>
            <div class="header-badges">
              <span class="badge tribunal">{{ processo.tribunal }}</span>
              <span class="badge grau">{{ getGrauLabel(processo.grau) }}</span>
              <span class="badge formato">{{ processo.formato.nome }}</span>
            </div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-card">
            <h3>Informações Gerais</h3>
            <dl class="info-list">
              <dt>Classe Processual:</dt>
              <dd>{{ processo.classe.nome }} ({{ processo.classe.codigo }})</dd>

              <dt>Tribunal:</dt>
              <dd>{{ processo.tribunal }}</dd>

              <dt>Grau:</dt>
              <dd>{{ getGrauLabel(processo.grau) }}</dd>

              <dt>Data de Ajuizamento:</dt>
              <dd>{{ formatarData(processo.dataAjuizamento) }}</dd>

              <dt>Nível de Sigilo:</dt>
              <dd>{{ processo.nivelSigilo }}</dd>

              <dt>Sistema:</dt>
              <dd>{{ processo.sistema.nome }}</dd>

              <dt>Formato:</dt>
              <dd>{{ processo.formato.nome }}</dd>

              <dt>Última Atualização:</dt>
              <dd>{{ formatarData(processo.dataHoraUltimaAtualizacao) }}</dd>
            </dl>
          </div>

          <div class="detail-card">
            <h3>Órgão Julgador</h3>
            <dl class="info-list">
              <dt>Nome:</dt>
              <dd>{{ processo.orgaoJulgador.nome }}</dd>

              <dt>Código:</dt>
              <dd class="codigo">{{ processo.orgaoJulgador.codigo }}</dd>

              <dt>Município (IBGE):</dt>
              <dd>{{ processo.orgaoJulgador.codigoMunicipioIBGE }}</dd>
            </dl>
          </div>
        </div>

        <div v-if="processo.assuntos.length > 0" class="detail-card">
          <h3>Assuntos</h3>
          <div class="assuntos-list">
            <div v-for="assunto in processo.assuntos" :key="assunto.codigo" class="assunto-item">
              <span class="assunto-nome">{{ assunto.nome }}</span>
              <span class="assunto-codigo">#{{ assunto.codigo }}</span>
            </div>
          </div>
        </div>

        <MovementTimeline v-if="processo.movimentos.length > 0" :movimentos="processo.movimentos" />

        <div v-else class="no-movements">
          <p>Nenhum movimento registrado para este processo</p>
        </div>
      </div>

      <div v-else class="not-found">
        <p>Processo não encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { Processo } from '@/types/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MovementTimeline from '@/components/MovementTimeline.vue'

const route = useRoute()
const { getProcess, loading, error } = useApi()

const processo = ref<Processo | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  processo.value = await getProcess(id)
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
    return new Date(data).toLocaleDateString('pt-BR', {
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
.process-view {
  min-height: 100vh;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--spacing-lg);
  color: var(--color-accent);
  font-weight: 500;
  transition: all var(--transition-base);
}

.back-link:hover {
  transform: translateX(-4px);
  color: var(--color-accent-light);
}

.error-message,
.not-found {
  background-color: #fee;
  border: 1px solid #fcc;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  color: #c00;
  text-align: center;
}

.process-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.detail-header {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.header-info h1 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-accent);
  font-family: 'Courier New', monospace;
}

.header-badges {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  background-color: var(--color-accent);
  color: white;
}

.badge.grau {
  background-color: var(--color-accent-light);
}

.badge.formato {
  background-color: var(--color-info);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.detail-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  animation: slideUp var(--transition-slow) ease-out;
}

.detail-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}

.detail-card h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: var(--spacing-sm);
}

.info-list {
  display: grid;
  gap: var(--spacing-md);
}

dt {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

dd {
  margin-left: 0;
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-sm);
}

dd.codigo {
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.assuntos-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.assunto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-accent);
}

.assunto-nome {
  color: var(--color-text-primary);
  font-weight: 500;
}

.assunto-codigo {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.no-movements {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .process-view {
    padding: var(--spacing-md);
  }

  .detail-header {
    padding: var(--spacing-lg);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
