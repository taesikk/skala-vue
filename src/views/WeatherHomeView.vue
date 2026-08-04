<script setup>
import { ref, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherDetailModal from '@/components/exercise/WeatherDetailModal.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'
import NearbyRestaurantPanel from '@/components/exercise/NearbyRestaurantPanel.vue'
import { CITY_LIST } from '@/constants/cities'
import { fetchWeatherForCities } from '@/services/weatherApi'

const isLoading = ref(true)
const loadError = ref(null)
const weatherList = ref([])

async function loadWeather() {
  isLoading.value = true
  loadError.value = null
  try {
    weatherList.value = await fetchWeatherForCities(CITY_LIST)
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

onMounted(loadWeather)

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const activeDetailCity = ref(null)

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const statusMessage = computed(() =>
  selectedCityInfo.value
    ? `${selectedCityInfo.value.name}이(가) 선택되었습니다.`
    : '카드를 클릭하거나 검색해 보세요.',
)

// 카드를 선택했거나, 검색어로 도시가 좁혀졌을 때 근처 맛집 패널에 쓸 기준 도시.
const activeRegionCity = computed(() => {
  if (selectedCityInfo.value) return selectedCityInfo.value
  if (searchQuery.value.trim() && filteredWeatherList.value.length > 0) {
    return filteredWeatherList.value[0]
  }
  return null
})

const weatherSectionRef = ref(null)

// 카드를 클릭하거나 검색으로 도시가 잡히면, 그 아래에 나타나는 맛집 패널을
// 놓치지 않도록 지역별 날씨 현황 섹션이 화면 맨 위로 오게 스크롤한다.
watch(
  () => activeRegionCity.value?.id,
  async (newId) => {
    if (!newId) return
    await nextTick()
    weatherSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },
)

watch(selectedCityInfo, () => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}"`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`,
  )
})

function onQueryUpdate(value) {
  searchQuery.value = value
}

function onSelectCard(cityItem) {
  selectedCityInfo.value = cityItem
}

function onClickDetail(cityItem) {
  selectedCityInfo.value = cityItem
  activeDetailCity.value = cityItem
}

function closeDetailModal() {
  activeDetailCity.value = null
}
</script>

<template>
  <div class="page-container">
    <Transition name="fade" mode="out-in">
      <div v-if="isLoading" key="loader" class="loader-stage">
        <HourglassLoader />
      </div>

      <div v-else-if="loadError" key="error" class="error-stage">
        <p class="error-emoji">⚠️</p>
        <p class="error-message">{{ loadError }}</p>
        <button class="error-retry-btn" type="button" @click="loadWeather">다시 시도</button>
      </div>

      <div v-else key="content">
        <header class="hero">
          <h1 class="hero__title">지역의 날씨와 맛집을 한눈에</h1>
          <p class="hero__subtitle">지역을 검색하거나 카드를 눌러 상세 정보를 확인해 보세요.</p>
        </header>

        <BaseDashboardCard title="도시 검색" icon="🔍">
          <SearchBar
            :search-query="searchQuery"
            :status-override="selectedCityInfo ? statusMessage : null"
            @update-query="onQueryUpdate"
          />
        </BaseDashboardCard>

        <div ref="weatherSectionRef" class="weather-section-anchor">
          <BaseDashboardCard title="지역별 날씨 현황" icon="📋">
            <div class="weather-grid">
              <WeatherCard
                v-for="city in filteredWeatherList"
                :key="city.id"
                :city-item="city"
                @select-card="onSelectCard"
                @click-detail="onClickDetail"
              />
            </div>
            <p v-if="filteredWeatherList.length === 0" class="empty-message">
              검색 결과가 일치하는 도시가 없습니다.
            </p>
          </BaseDashboardCard>
        </div>

        <Transition name="fade">
          <BaseDashboardCard
            v-if="activeRegionCity"
            :key="activeRegionCity.id"
            :title="`${activeRegionCity.name} 근처 맛집`"
            icon="🍽️"
          >
            <NearbyRestaurantPanel :city="activeRegionCity" />
          </BaseDashboardCard>
        </Transition>
      </div>
    </Transition>

    <WeatherDetailModal :city="activeDetailCity" @close="closeDetailModal" />
  </div>
</template>

<style scoped>
.loader-stage {
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-stage {
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  text-align: center;
  padding: var(--space-6);
}

.error-emoji {
  font-size: 2.4rem;
}

.error-message {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  max-width: 320px;
}

.error-retry-btn {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.error-retry-btn:hover {
  opacity: 0.85;
}

.hero {
  margin-bottom: var(--space-6);
  animation: fade-up 0.5s var(--ease-out) both;
}

.hero__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.hero__subtitle {
  margin-top: var(--space-2);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.weather-section-anchor {
  scroll-margin-top: 76px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(3, 190px);
  justify-content: center;
  gap: 14px;
}

@media (max-width: 640px) {
  .weather-grid {
    grid-template-columns: repeat(2, 190px);
  }
}

@media (max-width: 430px) {
  .weather-grid {
    grid-template-columns: repeat(1, 190px);
  }
}

.empty-message {
  text-align: center;
  padding: var(--space-4);
  color: var(--color-text-muted);
  font-size: 0.88rem;
}
</style>
