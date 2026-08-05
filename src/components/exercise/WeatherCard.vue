<!--
  도시별 날씨 요약 카드.
  클릭하면 카드가 선택되고(select-card), 상세보기 버튼을 누르면
  상세 모달을 여는 이벤트(click-detail)를 emit한다.
-->
<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { getStatusEmoji } from '@/constants/weatherStatus'
import WeatherIcon from '@/components/exercise/WeatherIcon.vue'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const statusEmoji = computed(() => getStatusEmoji(props.cityItem.status))

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const isWarm = computed(() => props.cityItem.temp >= 25)

function handleSelect() {
  emit('select-card', props.cityItem)
}

function handleDetail() {
  emit('click-detail', props.cityItem)
}
</script>

<template>
  <!-- From Uiverse.io by vinodjangid07 (weather 버전으로 각색) -->
  <article class="card" @click="handleSelect">
    <div class="wrapper">
      <div class="card-image">
        <WeatherIcon :status="cityItem.status" size="84px" />
      </div>
      <div class="content">
        <p class="title">{{ cityItem.name }} · {{ statusEmoji }} {{ cityItem.status }}</p>
        <p class="title price">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      </div>
      <button class="card-btn" type="button" @click.stop="handleDetail">상세보기</button>
    </div>
    <p class="tag" :class="isWarm ? 'tag--warm' : 'tag--cool'">
      {{ isWarm ? '더움' : '선선함' }}
    </p>
  </article>
</template>

<style scoped>
.card {
  width: 190px;
  height: 254px;
  background: #f5f5f5;
  border: 1px solid var(--color-border);
  padding: 15px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
  animation: fade-up 0.45s var(--ease-out) both;
}

.card:nth-child(1) {
  animation-delay: 0.05s;
}
.card:nth-child(2) {
  animation-delay: 0.11s;
}
.card:nth-child(3) {
  animation-delay: 0.17s;
}
.card:nth-child(4) {
  animation-delay: 0.23s;
}
.card:nth-child(5) {
  animation-delay: 0.29s;
}
.card:nth-child(6) {
  animation-delay: 0.35s;
}

.wrapper {
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.card-image {
  width: 100%;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.content {
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.title {
  font-size: 0.72em;
  text-transform: uppercase;
  font-weight: 500;
  color: #4d4d4d;
}

.price {
  font-size: 1em;
  font-weight: 700;
  color: rgb(24, 24, 24);
  white-space: nowrap;
}

.card-btn {
  margin-top: 10px;
  width: 100%;
  height: 40px;
  background-color: rgb(24, 24, 24);
  border: none;
  border-radius: 40px;
  color: white;
  transition: all 0.3s;
  cursor: pointer;
  font-weight: 500;
}

.card:hover .card-image {
  height: 120px;
}

.card:hover .card-btn {
  margin-top: 0;
}

.card-btn:hover {
  background-color: greenyellow;
  color: rgb(35, 35, 35);
}

.card:hover {
  background-color: white;
  box-shadow: var(--shadow-md);
}

.tag {
  position: absolute;
  color: rgb(0, 0, 0);
  left: 12px;
  top: 12px;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.75em;
  font-weight: 500;
}

.tag--warm {
  background-color: #ffb020;
}

.tag--cool {
  background-color: greenyellow;
}
</style>
