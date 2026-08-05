<!--
  선택된 도시의 상세 날씨 정보를 보여주는 팝업 모달.
  city prop이 있을 때만 표시되며, 배경 클릭·ESC·닫기 버튼으로 닫을 수 있다.
-->
<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { getStatusBlobColor } from '@/constants/weatherStatus'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const configStore = useConfigStore()

const blobColor = computed(() => getStatusBlobColor(props.city?.status))

const displayTemp = computed(() => {
  if (!props.city) return null
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function close() {
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.city) {
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="city" class="modal-backdrop" @click.self="close">
        <!-- From Uiverse.io by dylanharriscameron (blob 카드 구조를 상세보기 팝업에 적용) -->
        <div class="modal-card" role="dialog" aria-modal="true" :aria-label="`${city.name} 상세 날씨`">
          <div class="modal-blob" :style="{ backgroundColor: blobColor }"></div>
          <div class="modal-blob modal-blob--soft" :style="{ backgroundColor: blobColor }"></div>

          <div class="modal-glass">
            <button class="modal-close" type="button" aria-label="닫기" @click="close">✕</button>

            <header class="modal-header">
              <span class="modal-badge" :style="{ borderColor: blobColor }">
                <WeatherIcon :status="city.status" size="40px" />
              </span>
              <div>
                <h3 class="modal-title">{{ city.name }} 상세 날씨</h3>
                <p class="modal-region">{{ city.region }}</p>
              </div>
            </header>

            <dl class="modal-grid">
              <div class="modal-row">
                <dt>🌡️ 실시간 기온</dt>
                <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
              </div>
              <div class="modal-row">
                <dt>🌤️ 기상 현황</dt>
                <dd>{{ city.status }}</dd>
              </div>
              <div class="modal-row">
                <dt>💧 대기 습도</dt>
                <dd>{{ city.humidity }}%</dd>
              </div>
              <div class="modal-row">
                <dt>🌬️ 현재 풍속</dt>
                <dd>{{ city.windSpeed }}m/s</dd>
              </div>
            </dl>

            <button class="modal-confirm" type="button" @click="close">닫기</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: rgba(12, 13, 16, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 380px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow:
    28px 28px 64px rgba(0, 0, 0, 0.28),
    -16px -16px 40px rgba(255, 255, 255, 0.06);
  animation: modalPop 0.3s var(--ease-out);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  opacity: 0.9;
  filter: blur(34px);
  animation: blob-bounce 7s infinite ease;
}

.modal-blob--soft {
  width: 170px;
  height: 170px;
  opacity: 0.55;
  filter: blur(26px);
  animation-duration: 9s;
  animation-direction: reverse;
}

@keyframes blob-bounce {
  0% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-100%, -100%) translate3d(100%, 0, 0);
  }
  50% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }
  75% {
    transform: translate(-100%, -100%) translate3d(0, 100%, 0);
  }
  100% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
}

.modal-glass {
  position: relative;
  z-index: 2;
  margin: 5px;
  padding: var(--space-6);
  background: var(--color-surface-translucent);
  backdrop-filter: blur(26px);
  -webkit-backdrop-filter: blur(26px);
  border-radius: calc(var(--radius-lg) - 6px);
  outline: 2px solid rgba(255, 255, 255, 0.55);
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.modal-close:hover {
  background: var(--color-border);
  transform: rotate(90deg);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding-right: var(--space-5);
}

.modal-badge {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 2px solid;
  box-shadow: var(--shadow-sm);
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.modal-region {
  margin-top: 2px;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.modal-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.modal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-soft);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.modal-row dt {
  color: var(--color-text-muted);
  font-weight: 600;
}

.modal-row dd {
  font-weight: 700;
}

.modal-confirm {
  width: 100%;
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.modal-confirm:hover {
  opacity: 0.85;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s var(--ease-out);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
