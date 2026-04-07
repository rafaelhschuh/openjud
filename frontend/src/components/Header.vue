<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo-link">
        <div class="logo">⚖️ OpenJud</div>
        <p class="subtitle">Rede Social Jurídica</p>
      </router-link>

      <div class="header-actions">
        <button
          class="settings-btn"
          @click="openSettings"
          title="Configurações"
        >
          ⚙️
        </button>

        <button class="theme-toggle" @click="toggleTheme" :title="isDark() ? 'Modo claro' : 'Modo escuro'">
          <span v-if="isDark()" class="theme-icon">☀️</span>
          <span v-else class="theme-icon">🌙</span>
        </button>
      </div>
    </div>

    <SettingsModal :isOpen="showSettings" @close="closeSettings" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import SettingsModal from './SettingsModal.vue'

const themeStore = useThemeStore()
const showSettings = ref(false)

const isDark = () => themeStore.isDark()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const openSettings = () => {
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}
</script>

<style scoped>
.header {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.logo-link:hover {
  transform: scale(1.02);
}

.logo {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.subtitle {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.settings-btn,
.theme-toggle {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.settings-btn:hover,
.theme-toggle:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-accent);
  transform: scale(1.05);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

