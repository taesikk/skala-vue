<script setup>
import { ref, onMounted } from 'vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import RankingList from '@/components/exercise/RankingList.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'
import { fetchTrendingCoins } from '@/services/coingeckoApi'
import { fetchPopularVideos } from '@/services/youtubeApi'

// loading | ready | error
const coinPhase = ref('loading')
const coinError = ref(null)
const coins = ref([])

const videoPhase = ref('loading')
const videoError = ref(null)
const videos = ref([])

async function loadCoins() {
  coinPhase.value = 'loading'
  try {
    coins.value = await fetchTrendingCoins(10)
    coinPhase.value = 'ready'
  } catch (err) {
    coinError.value = err?.message || '인기 코인 정보를 불러오지 못했습니다.'
    coinPhase.value = 'error'
  }
}

async function loadVideos() {
  videoPhase.value = 'loading'
  try {
    videos.value = await fetchPopularVideos(10)
    videoPhase.value = 'ready'
  } catch (err) {
    videoError.value = err?.message || '인기 영상 정보를 불러오지 못했습니다.'
    videoPhase.value = 'error'
  }
}

onMounted(() => {
  loadCoins()
  loadVideos()
})
</script>

<template>
  <div class="page-container">
    <header class="hero">
      <h1 class="hero__title">지금 가장 핫한 TOP 10</h1>
      <p class="hero__subtitle">실시간 인기 코인과 유튜브 인기 급상승 동영상 TOP 10을 5개씩 순위대로 보여드려요.</p>
    </header>

    <BaseDashboardCard title="실시간 인기 코인" icon="🪙">
      <RankingList v-if="coinPhase === 'ready'" :items="coins" />
      <div v-else-if="coinPhase === 'loading'" class="loader-row">
        <HourglassLoader message="인기 코인을 불러오는 중" />
      </div>
      <template v-else-if="coinPhase === 'error'">
        <p class="error-text">⚠️ {{ coinError }}</p>
        <button class="retry-btn" type="button" @click="loadCoins">다시 시도</button>
      </template>
      <p v-if="coinPhase === 'ready'" class="ticker-caption">CoinGecko 기준 실시간 검색 트렌딩 코인 TOP10</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="유튜브 인기 영상" icon="▶️">
      <RankingList v-if="videoPhase === 'ready'" :items="videos" />
      <div v-else-if="videoPhase === 'loading'" class="loader-row">
        <HourglassLoader message="인기 영상을 불러오는 중" />
      </div>
      <template v-else-if="videoPhase === 'error'">
        <p class="error-text">⚠️ {{ videoError }}</p>
        <button class="retry-btn" type="button" @click="loadVideos">다시 시도</button>
      </template>
      <p v-if="videoPhase === 'ready'" class="ticker-caption">YouTube 대한민국 인기 급상승 동영상 TOP10</p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
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

.loader-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) 0;
}

.error-text {
  font-size: 0.85rem;
  color: var(--color-warm);
  background: var(--color-warm-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
}

.retry-btn {
  padding: var(--space-2) var(--space-5);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.retry-btn:hover {
  opacity: 0.85;
}

.ticker-caption {
  margin-top: var(--space-2);
  font-size: 0.76rem;
  color: var(--color-text-muted);
  text-align: right;
}
</style>
