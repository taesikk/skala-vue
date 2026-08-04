<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__brand">
        <span class="app-header__brand-icon">
          <WeatherIcon status="맑음" size="22px" />
        </span>
        날씨도 좋은데 뭐먹을까?
      </RouterLink>
      <UnitToggler />
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
  background: rgba(250, 250, 250, 0.82);
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

main {
  flex: 1;
}
</style>
