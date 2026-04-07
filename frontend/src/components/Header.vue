<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <h1 class="logo">⚖️ OpenJud</h1>
        <p class="subtitle">Pesquisa de Processos Judiciais</p>
      </div>

      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Modo claro' : 'Modo escuro'">
        <span v-if="isDark" class="theme-icon">☀️</span>
        <span v-else class="theme-icon">🌙</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const isDark = () => themeStore.isDark()

const toggleTheme = () => {
  themeStore.toggleTheme()
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

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.logo {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

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
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  background-color: var(--color-bg-tertiary);
  transform: scale(1.05);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
