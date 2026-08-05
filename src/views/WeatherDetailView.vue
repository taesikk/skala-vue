<!--
  날씨 상세 페이지.
  라우트 파라미터(cityId)로 도시를 찾아 상세 기상 정보를 조회하고
  카드 형태로 보여준다.
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { getStatusBlobColor } from '@/constants/weatherStatus'
import { getCityById } from '@/constants/cities'
import { fetchCurrentWeatherByCoords } from '@/services/weatherApi'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const isLoading = ref(true)
const loadError = ref(null)
const cityDetail = ref(null)

async function loadDetail() {
  const city = getCityById(route.params.cityId)
  if (!city) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  loadError.value = null
  try {
    const weather = await fetchCurrentWeatherByCoords(city.lat, city.lon)
    cityDetail.value = { ...city, ...weather }
  } catch (err) {
    loadError.value =
      err?.response?.data?.reason ||
      err?.response?.data?.message ||
      err?.message ||
      '날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDetail)

const statusBlobColor = computed(() => getStatusBlobColor(cityDetail.value?.status))

const displayTemp = computed(() => {
  if (!cityDetail.value) return null
  const rawTemp = cityDetail.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="page-container">
    <div v-if="isLoading" class="loader-stage">
      <HourglassLoader />
    </div>

    <section v-else-if="loadError" class="detail-card detail-card--empty">
      <p class="error-emoji">⚠️</p>
      <p>{{ loadError }}</p>
      <button class="detail-card__back-btn" type="button" @click="loadDetail">다시 시도</button>
    </section>

    <section v-else-if="cityDetail" class="detail-card">
      <header class="detail-card__header">
        <span class="detail-card__icon" :style="{ borderColor: statusBlobColor }">
          <WeatherIcon :status="cityDetail.status" size="40px" />
        </span>
        <div>
          <h2 class="detail-card__title">{{ cityDetail.name }} 지역별 상세 기상 관측 정보</h2>
          <p class="detail-card__subtitle">{{ cityDetail.region }}</p>
        </div>
      </header>

      <dl class="detail-card__grid">
        <div class="detail-card__row">
          <dt>📍 지정 지역</dt>
          <dd>{{ cityDetail.region }}</dd>
        </div>
        <div class="detail-card__row">
          <dt>🌡️ 실시간 기온</dt>
          <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div class="detail-card__row">
          <dt>🌤️ 기상 현황</dt>
          <dd>{{ cityDetail.status }}</dd>
        </div>
        <div class="detail-card__row">
          <dt>💧 대기 습도</dt>
          <dd>{{ cityDetail.humidity }}%</dd>
        </div>
        <div class="detail-card__row">
          <dt>🌬️ 현재 풍속</dt>
          <dd>{{ cityDetail.windSpeed }}m/s</dd>
        </div>
      </dl>

      <button class="detail-card__back-btn" type="button" @click="goBack">
        ← 메인 대시보드로 돌아가기
      </button>
    </section>

    <section v-else class="detail-card detail-card--empty">
      <p>해당 도시 코드의 관측 정보를 찾을 수 없습니다.</p>
      <button class="detail-card__back-btn" type="button" @click="goBack">
        ← 메인 대시보드로 돌아가기
      </button>
    </section>
  </div>
</template>

<style scoped>
.loader-stage {
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-emoji {
  font-size: 2.4rem;
}

.detail-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  animation: fade-up 0.5s var(--ease-out) both;
}

.detail-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.detail-card__icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 2px solid;
  box-shadow: var(--shadow-sm);
}

.detail-card__title {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.detail-card__subtitle {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.detail-card__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.detail-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-soft);
  border-radius: var(--radius-sm);
  font-size: 0.92rem;
  transition: transform 0.15s ease;
}

.detail-card__row:hover {
  transform: translateX(2px);
}

.detail-card__row dt {
  color: var(--color-text-muted);
  font-weight: 600;
}

.detail-card__row dd {
  font-weight: 700;
}

.detail-card__back-btn {
  width: 100%;
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.detail-card__back-btn:hover {
  opacity: 0.85;
}

.detail-card__back-btn:active {
  transform: scale(0.98);
}

.detail-card--empty {
  text-align: center;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
