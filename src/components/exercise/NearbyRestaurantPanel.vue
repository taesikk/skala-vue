<script setup>
import { ref, watch, onMounted } from 'vue'
import { searchRestaurantsNearby } from '@/services/kakaoLocalApi'
import KakaoMap from '@/components/exercise/KakaoMap.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const isLoading = ref(true)
const loadError = ref(null)
const restaurants = ref([])

async function load() {
  isLoading.value = true
  loadError.value = null
  try {
    restaurants.value = await searchRestaurantsNearby(props.city.lat, props.city.lon)
  } catch (err) {
    loadError.value =
      err?.response?.data?.message || err?.message || '맛집 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function formatDistance(distance) {
  if (distance == null) return ''
  return distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`
}

onMounted(load)
watch(() => props.city.id, load)
</script>

<template>
  <div class="restaurant-panel">
    <div v-if="isLoading" class="restaurant-panel__loading">
      <HourglassLoader />
    </div>

    <div v-else-if="loadError" class="restaurant-panel__error">
      <p>⚠️ {{ loadError }}</p>
      <button class="restaurant-panel__retry-btn" type="button" @click="load">다시 시도</button>
    </div>

    <template v-else>
      <KakaoMap :center-lat="city.lat" :center-lon="city.lon" :places="restaurants" />

      <ul v-if="restaurants.length" class="restaurant-list">
        <li v-for="place in restaurants" :key="place.id" class="restaurant-item">
          <div class="restaurant-item__main">
            <p class="restaurant-item__name">{{ place.name }}</p>
            <p class="restaurant-item__meta">
              {{ place.category }}<template v-if="place.distance"> · {{ formatDistance(place.distance) }}</template>
            </p>
            <p class="restaurant-item__address">{{ place.address }}</p>
            <p v-if="place.phone" class="restaurant-item__phone">☎ {{ place.phone }}</p>
          </div>
          <a
            class="restaurant-item__menu-btn"
            :href="place.placeUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            메뉴 보기
          </a>
        </li>
      </ul>
      <p v-else class="restaurant-panel__empty">근처 맛집 정보를 찾지 못했습니다.</p>
    </template>
  </div>
</template>

<style scoped>
.restaurant-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.restaurant-panel__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

.restaurant-panel__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.restaurant-panel__retry-btn {
  padding: var(--space-2) var(--space-5);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.restaurant-panel__empty {
  text-align: center;
  padding: var(--space-4);
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.restaurant-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.restaurant-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.restaurant-item__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.restaurant-item__name {
  font-weight: 700;
  font-size: 0.95rem;
}

.restaurant-item__meta {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-weight: 600;
}

.restaurant-item__address {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.restaurant-item__phone {
  font-size: 0.8rem;
  color: var(--color-text-faint);
}

.restaurant-item__menu-btn {
  flex-shrink: 0;
  padding: 9px 16px;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}

.restaurant-item__menu-btn:hover {
  opacity: 0.85;
}
</style>
