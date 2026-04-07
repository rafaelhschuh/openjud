<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>⚙️ Configurações</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <!-- API Key Section -->
        <div class="settings-section">
          <h3>🔑 API DataJud</h3>
          <p class="section-description">
            Adicione sua chave de API para melhorar os limites de requisições. Deixe vazio para usar a chave pública.
          </p>

          <div class="form-group">
            <label for="apiKey">Chave de API:</label>
            <input
              id="apiKey"
              v-model="apiKeyInput"
              type="password"
              placeholder="cDZHYzlZa0JadVREZDJCend..."
              class="form-input"
            />
            <p class="hint">
              Sua chave pode ser obtida em:
              <a href="https://datajud-wiki.cnj.jus.br/api-publica/" target="_blank">DataJud Wiki</a>
            </p>
          </div>

          <button @click="saveApiKey" class="btn btn-primary" :disabled="!apiKeyInput || savingApiKey">
            <span v-if="!savingApiKey">💾 Salvar Chave</span>
            <span v-else>⏳ Salvando...</span>
          </button>

          <div v-if="apiKeySuccess" class="success-message">✅ Chave salva com sucesso!</div>
          <div v-if="apiKeyError" class="error-message">❌ {{ apiKeyError }}</div>
        </div>

        <!-- Cache Section -->
        <div class="settings-section">
          <h3>💾 Cache Local</h3>
          <p class="section-description">Limpe o cache de resultados se necessário. O cache expira automaticamente a cada 5 minutos.</p>

          <button @click="handleClearCache" class="btn btn-secondary">🗑️ Limpar Cache</button>

          <div v-if="cacheCleared" class="success-message">✅ Cache limpo com sucesso!</div>
        </div>

        <!-- About Section -->
        <div class="settings-section">
          <h3>ℹ️ Sobre</h3>
          <p class="section-description">
            <strong>OpenJud</strong> - Pesquisa de Processos Judiciais<br />
            Versão 1.0.0<br />
            <br />
            Dados fornecidos pela API Pública do DataJud do CNJ.<br />
            <a href="https://datajud-wiki.cnj.jus.br/" target="_blank">Mais informações</a>
          </p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-secondary">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { setApiKey, clearCache } = useApi()

const apiKeyInput = ref('')
const savingApiKey = ref(false)
const apiKeySuccess = ref(false)
const apiKeyError = ref('')
const cacheCleared = ref(false)

const closeModal = () => {
  emit('close')
  reset()
}

const reset = () => {
  apiKeyInput.value = ''
  apiKeySuccess.value = false
  apiKeyError.value = ''
  cacheCleared.value = false
}

const saveApiKey = async () => {
  if (!apiKeyInput.value) return

  savingApiKey.value = true
  apiKeySuccess.value = false
  apiKeyError.value = ''

  const success = await setApiKey(apiKeyInput.value)

  savingApiKey.value = false

  if (success) {
    apiKeySuccess.value = true
    apiKeyInput.value = ''
    setTimeout(() => {
      apiKeySuccess.value = false
    }, 3000)
  } else {
    apiKeyError.value = 'Erro ao salvar a chave. Tente novamente.'
  }
}

const handleClearCache = () => {
  clearCache()
  cacheCleared.value = true
  setTimeout(() => {
    cacheCleared.value = false
  }, 3000)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--transition-fast);
}

.modal-container {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp var(--transition-base);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-bg-secondary);
}

.modal-header h2 {
  margin: 0;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--color-accent);
}

.modal-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.settings-section h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

.section-description {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.section-description a {
  color: var(--color-accent);
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.hint {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
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
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}

.success-message {
  padding: var(--spacing-md);
  background-color: #f0fdf4;
  border-left: 4px solid var(--color-success);
  border-radius: var(--radius-md);
  color: #15803d;
  font-size: var(--font-size-sm);
  animation: slideUp var(--transition-fast);
}

.error-message {
  padding: var(--spacing-md);
  background-color: #fef2f2;
  border-left: 4px solid var(--color-error);
  border-radius: var(--radius-md);
  color: #991b1b;
  font-size: var(--font-size-sm);
  animation: slideUp var(--transition-fast);
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  position: sticky;
  bottom: 0;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }

  .modal-body {
    padding: var(--spacing-md);
    gap: var(--spacing-lg);
  }
}
</style>
