<!--
  날씨 상태(맑음/구름/비/눈/번개)에 맞는 애니메이션 SVG 아이콘.
  status prop에 따라 모양과 애니메이션 클래스를 다르게 렌더링한다.
-->
<script setup>
import { computed } from 'vue'
import { getStatusAnimKey, getStatusBlobColor } from '@/constants/weatherStatus'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '48px',
  },
})

const animKey = computed(() => getStatusAnimKey(props.status))
const color = computed(() => getStatusBlobColor(props.status))
</script>

<template>
  <span class="weather-icon" :class="`weather-icon--${animKey}`" :style="{ width: size, height: size, color }">
    <svg
      class="w-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- 맑음 -->
      <template v-if="animKey === 'sunny'">
        <g class="w-rays">
          <line x1="12" y1="1.5" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22.5" />
          <line x1="4.2" y1="4.2" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.8" y2="19.8" />
          <line x1="1.5" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22.5" y2="12" />
          <line x1="4.2" y1="19.8" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.8" y2="4.2" />
        </g>
        <circle class="w-sun-body" cx="12" cy="12" r="5" />
      </template>

      <!-- 구름 / 약간 구름 -->
      <template v-else-if="animKey === 'cloudy'">
        <path class="w-cloud-outline" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </template>

      <!-- 비 -->
      <template v-else-if="animKey === 'rain'">
        <path
          class="w-cloud-outline"
          d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
        />
        <g class="w-rain-drops">
          <line x1="16" y1="13" x2="16" y2="21" />
          <line x1="8" y1="13" x2="8" y2="21" />
          <line x1="12" y1="15" x2="12" y2="23" />
        </g>
      </template>

      <!-- 눈 -->
      <template v-else-if="animKey === 'snow'">
        <path
          class="w-cloud-outline"
          d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
        />
        <g class="w-snow-dots">
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="8" y1="20" x2="8.01" y2="20" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <line x1="12" y1="22" x2="12.01" y2="22" />
          <line x1="16" y1="16" x2="16.01" y2="16" />
          <line x1="16" y1="20" x2="16.01" y2="20" />
        </g>
      </template>

      <!-- 번개 -->
      <template v-else-if="animKey === 'thunder'">
        <path
          class="w-cloud-outline"
          d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"
        />
        <polyline class="w-bolt" points="13 11 9 17 15 17 11 23" />
      </template>
    </svg>
  </span>
</template>

<!--
  weather-icon__* / w-* 클래스는 앱 전역에서 유일하게 쓰이며, 카드 호버 시
  부모(WeatherCard.vue)의 .card:hover 셀렉터로 애니메이션을 증폭시켜야
  하므로 scoped를 사용하지 않는다.
-->
<style>
.weather-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.w-svg {
  width: 82%;
  height: 82%;
  overflow: visible;
}

/* 맑음 */
.weather-icon--sunny .w-sun-body {
  transform-box: fill-box;
  transform-origin: center;
  animation: wSunPulse 3s ease-in-out infinite;
}
.weather-icon--sunny .w-rays {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation: wSunSpin 18s linear infinite;
}
@keyframes wSunPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes wSunSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 구름 / 약간 구름 */
.weather-icon--cloudy .w-svg {
  animation: wCloudFloat 3.6s ease-in-out infinite;
}
@keyframes wCloudFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6%);
  }
}

/* 비 */
.w-rain-drops line {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: wDropFall 1.1s ease-in infinite;
}
.w-rain-drops line:nth-child(1) {
  animation-delay: 0s;
}
.w-rain-drops line:nth-child(2) {
  animation-delay: 0.25s;
}
.w-rain-drops line:nth-child(3) {
  animation-delay: 0.5s;
}
@keyframes wDropFall {
  0% {
    transform: translateY(-30%);
    opacity: 0;
  }
  35% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  100% {
    transform: translateY(50%);
    opacity: 0;
  }
}

/* 눈 */
.w-snow-dots line {
  transform-box: fill-box;
  transform-origin: center;
  animation: wSnowTwinkle 1.6s ease-in-out infinite;
}
.w-snow-dots line:nth-child(1) {
  animation-delay: 0s;
}
.w-snow-dots line:nth-child(2) {
  animation-delay: 0.5s;
}
.w-snow-dots line:nth-child(3) {
  animation-delay: 1s;
}
.w-snow-dots line:nth-child(4) {
  animation-delay: 0.3s;
}
.w-snow-dots line:nth-child(5) {
  animation-delay: 0.8s;
}
.w-snow-dots line:nth-child(6) {
  animation-delay: 1.3s;
}
@keyframes wSnowTwinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(15%);
  }
}

/* 번개 */
.w-bolt {
  transform-box: fill-box;
  transform-origin: center;
  animation: wBoltFlash 2.2s ease-in-out infinite;
}
@keyframes wBoltFlash {
  0%,
  38%,
  100% {
    opacity: 0.55;
  }
  46%,
  54% {
    opacity: 1;
  }
}

/* ---------------------------------------------------------- */
/* 카드 호버 시 애니메이션 증폭                                     */
/* ---------------------------------------------------------- */
.card:hover .weather-icon--sunny .w-rays {
  animation-duration: 4s;
}
.card:hover .weather-icon--sunny .w-sun-body {
  animation-duration: 1s;
}
.card:hover .weather-icon--cloudy .w-svg {
  animation-duration: 1.2s;
}
.card:hover .w-rain-drops line {
  animation-duration: 0.5s;
}
.card:hover .w-snow-dots line {
  animation-duration: 0.7s;
}
.card:hover .w-bolt {
  animation-duration: 0.8s;
}
</style>
