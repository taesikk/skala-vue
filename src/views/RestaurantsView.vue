<!--
  전국 맛집 탭.
  손으로 만든 mock REST API(정규식 라우팅 + 인메모리 스토어)로
  나만의 맛집을 추가·삭제·검색하는 CRUD 화면.
-->
<script setup>
import { ref, onMounted } from 'vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import RestaurantCard from '@/components/exercise/RestaurantCard.vue'
import RestaurantForm from '@/components/exercise/RestaurantForm.vue'
import HourglassLoader from '@/components/exercise/HourglassLoader.vue'
import * as restaurantApi from '@/services/restaurantApiClient'

// 탭에 처음 들어왔을 때만 전체 화면 모래시계를 보여주기 위한 플래그.
// 이후 검색으로 인한 재조회는 목록 영역에만 작게 표시한다.
const hasLoadedOnce = ref(false)

const restaurants = ref([])
const isLoading = ref(true)
const loadError = ref(null)
const searchKeyword = ref('')

const isSubmitting = ref(false)
const submitError = ref(null)

let searchTimer = null

async function loadRestaurants() {
  isLoading.value = true
  loadError.value = null
  try {
    restaurants.value = await restaurantApi.getAll({ keyword: searchKeyword.value.trim() })
  } catch (err) {
    loadError.value = err.message
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
  }
}

onMounted(loadRestaurants)

function onSearchInput(value) {
  searchKeyword.value = value
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadRestaurants, 300)
}

async function handleAdd(payload) {
  isSubmitting.value = true
  submitError.value = null
  try {
    await restaurantApi.create(payload)
    await loadRestaurants()
  } catch (err) {
    submitError.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id) {
  try {
    await restaurantApi.remove(id)
    restaurants.value = restaurants.value.filter((item) => item.id !== id)
  } catch (err) {
    loadError.value = err.message
  }
}
</script>

<template>
  <div class="page-container">
    <Transition name="fade" mode="out-in">
      <div v-if="!hasLoadedOnce" key="loader" class="loader-stage">
        <HourglassLoader message="맛집 정보를 불러오는 중" />
      </div>

      <div v-else key="content">
        <BaseDashboardCard title="맛집 추가하기" icon="➕">
          <RestaurantForm :loading="isSubmitting" @submit="handleAdd" />
          <p v-if="submitError" class="error-text">⚠️ {{ submitError }}</p>
        </BaseDashboardCard>

        <BaseDashboardCard title="나만의 전국맛집" icon="🍽️">
          <input
            class="search-input"
            type="text"
            placeholder="가게 이름이나 주소로 검색 (예: 부산)"
            :value="searchKeyword"
            @input="onSearchInput($event.target.value)"
          />

          <div v-if="isLoading" class="loading-row">
            <HourglassLoader message="맛집 검색 중" />
          </div>

          <p v-else-if="loadError" class="error-text">⚠️ {{ loadError }}</p>

          <ul v-else-if="restaurants.length" class="restaurant-list">
            <li v-for="item in restaurants" :key="item.id">
              <RestaurantCard :restaurant="item" @delete="handleDelete" />
            </li>
          </ul>

          <p v-else class="empty-message">등록된 맛집이 없습니다. 위에서 추가해보세요.</p>
        </BaseDashboardCard>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.loader-stage {
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  border-radius: var(--radius-pill);
  padding: 10px 16px;
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  margin-bottom: var(--space-4);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-input::placeholder {
  color: var(--color-text-faint);
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.loading-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) 0;
}

.restaurant-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-message {
  text-align: center;
  padding: var(--space-4);
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.error-text {
  font-size: 0.82rem;
  color: var(--color-warm);
  background: var(--color-warm-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
}
</style>
