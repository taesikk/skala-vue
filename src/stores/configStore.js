// 온도 단위(섭씨/화씨)와 테마(라이트/다크) 설정을 관리하는 Pinia 스토어.
// 앱 전역에서 UnitToggler·ThemeToggle 등 여러 컴포넌트가 공유해서 사용한다.

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const theme = ref('light')

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { unit, unitSymbol, toggleUnit, theme, isDark, toggleTheme }
})
