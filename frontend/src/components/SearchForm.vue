<template>
  <form @submit.prevent="handleSubmit" class="search-form animate-slide-up">
    <div class="form-grid">
      <div class="form-group">
        <label for="numeroProcesso">Nº do Processo:</label>
        <input
          id="numeroProcesso"
          v-model="query.numeroProcesso"
          type="text"
          placeholder="Digite o número do processo"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="tribunal">Tribunal:</label>
        <select v-model="query.tribunal" id="tribunal" class="form-input">
          <option value="">Selecione um tribunal</option>
          <option value="TJSP">TJSP - São Paulo</option>
          <option value="TJMG">TJMG - Minas Gerais</option>
          <option value="TJRJ">TJRJ - Rio de Janeiro</option>
          <option value="TJBA">TJBA - Bahia</option>
          <option value="TJRS">TJRS - Rio Grande do Sul</option>
          <option value="STF">STF - Supremo Tribunal Federal</option>
          <option value="STJ">STJ - Superior Tribunal de Justiça</option>
        </select>
      </div>

      <div class="form-group">
        <label for="classe">Classe Processual:</label>
        <input
          id="classe"
          v-model="query.classe"
          type="text"
          placeholder="Ex: 1001"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="assunto">Assunto:</label>
        <input
          id="assunto"
          v-model="query.assunto"
          type="text"
          placeholder="Ex: Direito Civil"
          class="form-input"
        />
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="!loading">🔍 Pesquisar</span>
        <span v-else>⏳ Processando...</span>
      </button>
      <button type="button" @click="handleClear" class="btn btn-secondary">Limpar</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  loading: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  search: [query: Record<string, string>]
  clear: []
}>()

const query = reactive({
  numeroProcesso: '',
  tribunal: '',
  classe: '',
  assunto: '',
})

const handleSubmit = () => {
  emit('search', {
    numeroProcesso: query.numeroProcesso,
    tribunal: query.tribunal,
    classe: query.classe,
    assunto: query.assunto,
  })
}

const handleClear = () => {
  query.numeroProcesso = ''
  query.tribunal = ''
  query.classe = ''
  query.assunto = ''
  emit('clear')
}
</script>

<style scoped>
.search-form {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 1280px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

label {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  transition: all var(--transition-base);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}
</style>
