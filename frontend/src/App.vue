<template>
  <div id="app-root">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useThemeStore } from '@/stores/theme'

// Initialize theme on app load
const themeStore = useThemeStore()
</script>

<style scoped>
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
}

.main-content {
  flex: 1;
  background-color: var(--color-bg-primary);
}
</style>
