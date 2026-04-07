import { ref, watch, computed } from 'vue'

export type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')

  const isDark = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)

    // Update the document class for better CSS targeting
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  // Initialize on mount
  document.documentElement.setAttribute('data-theme', theme.value)
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }

  return {
    theme,
    isDark,
    toggleTheme,
  }
}
