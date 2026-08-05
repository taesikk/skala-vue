<!--
  섭씨/화씨 단위 토글 버튼(pill 스위치 형태).
  configStore의 unit 상태와 연동되며, 홈 탭에서만 표시된다.
-->
<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const isFahrenheit = computed(() => configStore.unit === 'fahrenheit')
</script>

<template>
  <button
    class="unit-toggler"
    type="button"
    :aria-pressed="isFahrenheit"
    :title="`날씨 단위 변경 (현재: ${configStore.unitSymbol})`"
    @click="configStore.toggleUnit"
  >
    <span class="unit-toggler__thumb" :class="{ 'unit-toggler__thumb--right': isFahrenheit }"></span>
    <span class="unit-toggler__option" :class="{ 'is-active': !isFahrenheit }">°C</span>
    <span class="unit-toggler__option" :class="{ 'is-active': isFahrenheit }">°F</span>
  </button>
</template>

<style scoped>
.unit-toggler {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 72px;
  height: 32px;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
  cursor: pointer;
  flex-shrink: 0;
}

.unit-toggler__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  transition: transform 0.28s var(--ease-out);
}

.unit-toggler__thumb--right {
  transform: translateX(100%);
}

.unit-toggler__option {
  position: relative;
  z-index: 1;
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-faint);
  transition: color 0.2s ease;
}

.unit-toggler__option.is-active {
  color: var(--color-surface);
}
</style>
