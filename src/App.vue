<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import ThemeToggle from '@/components/exercise/ThemeToggle.vue'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'
import GlassMenu from '@/components/exercise/GlassMenu.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const route = useRoute()

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', configStore.theme)
})

const BRAND_TAGLINE = {
  'weather-home': '거긴 뭐가 맛있대?',
  'national-restaurants': '내가 다녀온 진짜 맛집만 모았어요!',
  camping: '이번 주말엔 캠핑 어때요?',
  top: '지금 가장 핫한 게 뭘까?',
  settings: '로그인하고 내 정보도 볼까?',
}

const brandTagline = computed(() => BRAND_TAGLINE[route.name] ?? '오늘도 좋은 하루 보내세요')
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__brand">
        <span class="app-header__brand-icon">
          <WeatherIcon status="맑음" size="22px" />
        </span>
        {{ brandTagline }}
      </RouterLink>
      <GlassMenu />
      <div class="app-header__actions">
        <ThemeToggle />
        <UnitToggler v-if="route.name === 'weather-home'" />
      </div>
    </div>
    <span class="app-header__sheen"></span>
  </header>

  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-surface-translucent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.app-header__sheen {
  display: block;
  height: 2px;
  background: var(--gradient-brand);
  background-size: 200% 100%;
  animation: headerSheenSlide 6s ease-in-out infinite;
}

@keyframes headerSheenSlide {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.app-header__inner {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.01em;
  color: var(--color-ink);
  transition: opacity 0.15s ease;
}

.app-header__brand:hover {
  opacity: 0.7;
}

.app-header__brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

main {
  flex: 1;
}
</style>
