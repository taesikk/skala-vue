<!--
  캠핑 탭.
  내 위치 기준으로 날씨와 주변 캠핑장을 보여주거나 지역/이름 키워드로
  캠핑장을 검색하며, 버튼·그리드·카드 등 일부 UI는 Element Plus로 구성한다.
-->
<script setup>
import { ref, computed } from 'vue'
// 이 페이지에서만 부분적으로 Element Plus를 사용한다 (버튼/그리드/카드/태그).
// CSS import를 이 파일 안에 두면 이 라우트(지연 로딩 청크)에서만 로드되고
// 다른 페이지에는 전혀 영향을 주지 않는다.
import { ElButton, ElRow, ElCol, ElCard, ElTag, ElInput } from 'element-plus'
import 'element-plus/dist/index.css'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import KakaoMap from '@/components/exercise/KakaoMap.vue'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'
import { useConfigStore } from '@/stores/configStore'
import { getCurrentPosition } from '@/services/geolocation'
import { fetchCurrentWeatherByCoords } from '@/services/weatherApi'
import { searchCampsitesNearby, searchCampsitesByKeyword } from '@/services/kakaoLocalApi'

const configStore = useConfigStore()

// idle | locating | loading | ready | error
const phase = ref('idle')
// location(내 위치 기준) | search(키워드 검색)
const mode = ref(null)
const errorMessage = ref(null)
const coords = ref(null)
const weather = ref(null)
const campsites = ref([])
const isExtendedSearch = ref(false)
const searchKeywordInput = ref('')
const searchedKeyword = ref('')

const isBusy = computed(() => phase.value === 'locating' || phase.value === 'loading')

const resultTitle = computed(() =>
  mode.value === 'search' ? `"${searchedKeyword.value}" 검색 결과` : '내 주변 캠핑장',
)

const emptyMessage = computed(() =>
  mode.value === 'search' ? '검색 결과가 없어요. 다른 키워드로 검색해보세요.' : '근처에 등록된 캠핑장이 없어요.',
)

const displayTemp = computed(() => {
  if (!weather.value) return null
  const rawTemp = weather.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function formatDistance(distance) {
  if (distance == null) return ''
  return distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`
}

async function handleFindNearby() {
  if (isBusy.value) return
  errorMessage.value = null
  mode.value = 'location'
  phase.value = 'locating'

  try {
    coords.value = await getCurrentPosition()
  } catch (err) {
    errorMessage.value = err.message
    phase.value = 'error'
    return
  }

  phase.value = 'loading'
  try {
    const [weatherResult, campsiteResult] = await Promise.all([
      fetchCurrentWeatherByCoords(coords.value.lat, coords.value.lon),
      searchCampsitesNearby(coords.value.lat, coords.value.lon),
    ])
    weather.value = weatherResult
    campsites.value = campsiteResult.places
    isExtendedSearch.value = campsiteResult.extended
    phase.value = 'ready'
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || err?.message || '정보를 불러오지 못했습니다.'
    phase.value = 'error'
  }
}

async function handleSearch() {
  const keyword = searchKeywordInput.value.trim()
  if (!keyword || isBusy.value) return

  errorMessage.value = null
  mode.value = 'search'
  weather.value = null
  isExtendedSearch.value = false
  phase.value = 'loading'

  try {
    const results = await searchCampsitesByKeyword(keyword)
    campsites.value = results
    searchedKeyword.value = keyword
    if (results.length > 0) {
      coords.value = { lat: results[0].lat, lon: results[0].lon }
    }
    phase.value = 'ready'
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || err?.message || '검색에 실패했습니다.'
    phase.value = 'error'
  }
}

function handleRetry() {
  if (mode.value === 'search') {
    handleSearch()
  } else {
    handleFindNearby()
  }
}
</script>

<template>
  <div class="page-container">
    <BaseDashboardCard title="캠핑장 찾기" icon="🏕️">
      <p class="intro-text">내 위치를 기준으로 찾거나, 지역/캠핑장 이름으로 검색해보세요.</p>

      <div class="finder-row">
        <el-button
          type="primary"
          round
          :loading="phase === 'locating' || (phase === 'loading' && mode === 'location')"
          :disabled="isBusy"
          @click="handleFindNearby"
        >
          📍 내 위치로 찾기
        </el-button>

        <el-input
          v-model="searchKeywordInput"
          class="search-input"
          placeholder="지역/캠핑장 이름 (예: 가평)"
          clearable
          :disabled="isBusy"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :loading="phase === 'loading' && mode === 'search'" @click="handleSearch">
              검색
            </el-button>
          </template>
        </el-input>
      </div>

      <div v-if="phase === 'locating'" class="loader-row">
        <HourglassLoader message="내 위치를 확인하는 중" />
      </div>

      <div v-else-if="phase === 'loading'" class="loader-row">
        <HourglassLoader :message="mode === 'search' ? '캠핑장을 검색하는 중' : '근처 캠핑장을 찾는 중'" />
      </div>

      <p v-else-if="phase === 'error'" class="error-text">⚠️ {{ errorMessage }}</p>

      <div v-else-if="phase === 'ready' && mode === 'location' && weather" class="weather-summary">
        <span class="weather-summary__icon">
          <WeatherIcon :status="weather.status" size="40px" />
        </span>
        <div>
          <p class="weather-summary__temp">
            {{ displayTemp }}{{ configStore.unitSymbol }} · {{ weather.status }}
          </p>
          <p class="weather-summary__meta">습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }}m/s</p>
        </div>
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard v-if="phase === 'ready'" :title="resultTitle" icon="⛺">
      <KakaoMap v-if="coords" :center-lat="coords.lat" :center-lon="coords.lon" :places="campsites" />

      <p v-if="isExtendedSearch && campsites.length" class="extended-notice">
        근처(2km 이내)에는 캠핑장이 없어서, 가장 가까운 캠핑장 {{ campsites.length }}곳을 보여드려요.
      </p>

      <el-row v-if="campsites.length" :gutter="12" class="campsite-grid">
        <el-col v-for="site in campsites" :key="site.id" :xs="24" :sm="12">
          <el-card shadow="hover" class="campsite-card">
            <template #header>
              <div class="campsite-card__header">
                <span class="campsite-card__name">{{ site.name }}</span>
                <el-tag size="small" type="success" effect="light">{{ site.category || '캠핑장' }}</el-tag>
              </div>
            </template>
            <p class="campsite-card__address">{{ site.address }}</p>
            <p v-if="site.distance" class="campsite-card__distance">{{ formatDistance(site.distance) }}</p>
            <a
              class="campsite-card__link"
              :href="site.placeUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              상세보기
            </a>
          </el-card>
        </el-col>
      </el-row>
      <p v-else class="empty-message">{{ emptyMessage }}</p>

      <el-button class="retry-btn" round @click="handleRetry">다시 찾기</el-button>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.intro-text {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.finder-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.search-input {
  flex: 1 1 220px;
}

.loader-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) 0;
}

.error-text {
  font-size: 0.85rem;
  color: var(--color-warm);
  background: var(--color-warm-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
}

.weather-summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.weather-summary__icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
}

.weather-summary__temp {
  font-weight: 800;
  font-size: 1.05rem;
}

.weather-summary__meta {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.extended-notice {
  margin-top: var(--space-3);
  font-size: 0.82rem;
  color: var(--color-text-muted);
  background: var(--color-surface-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
}

.campsite-grid {
  margin-top: var(--space-4);
}

.campsite-card {
  margin-bottom: 12px;
}

.campsite-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.campsite-card__name {
  font-weight: 700;
  font-size: 0.92rem;
}

.campsite-card__address {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.campsite-card__distance {
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--color-accent);
  font-weight: 600;
}

.campsite-card__link {
  display: inline-block;
  margin-top: var(--space-2);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
}

.empty-message {
  text-align: center;
  padding: var(--space-4);
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.retry-btn {
  margin-top: var(--space-4);
  width: 100%;
}
</style>
