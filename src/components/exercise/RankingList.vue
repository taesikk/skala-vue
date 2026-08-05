<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  pageSize: {
    type: Number,
    default: 5,
  },
  intervalMs: {
    type: Number,
    default: 4500,
  },
})

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉']
const KEYCAP_DIGITS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

function rankEmoji(rank) {
  if (rank <= 3) return MEDAL_EMOJIS[rank - 1]
  if (rank <= 9) return KEYCAP_DIGITS[rank]
  if (rank === 10) return '🔟'
  return `${rank}위`
}

const pageCount = computed(() => Math.ceil(props.items.length / props.pageSize) || 1)
const activePage = ref(0)

const activeItems = computed(() => {
  const start = activePage.value * props.pageSize
  return props.items.slice(start, start + props.pageSize).map((item, i) => ({
    ...item,
    rank: start + i + 1,
  }))
})

let timerId = null

function stopRolling() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function startRolling() {
  stopRolling()
  if (pageCount.value <= 1) return
  timerId = setInterval(() => {
    activePage.value = (activePage.value + 1) % pageCount.value
  }, props.intervalMs)
}

watch(
  () => props.items,
  () => {
    activePage.value = 0
    startRolling()
  },
)

onMounted(startRolling)
onUnmounted(stopRolling)
</script>

<template>
  <div class="ranking-pager">
    <Transition name="page-fade" mode="out-in">
      <ul :key="activePage" class="ranking-list">
        <li v-for="item in activeItems" :key="item.id" class="ranking-list__row">
          <span class="ranking-list__rank">{{ rankEmoji(item.rank) }}</span>
          <span class="ranking-list__name">{{ item.primary }}</span>
          <span class="ranking-list__meta">{{ item.secondary }}</span>
        </li>
      </ul>
    </Transition>

    <div v-if="pageCount > 1" class="ranking-pager__dots">
      <span
        v-for="page in pageCount"
        :key="page"
        class="ranking-pager__dot"
        :class="{ 'is-active': page - 1 === activePage }"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.ranking-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ranking-list__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
}

.ranking-list__rank {
  flex-shrink: 0;
  min-width: 28px;
  font-size: 1.1rem;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.ranking-list__name {
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ranking-list__meta {
  flex-shrink: 0;
  max-width: 40%;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ranking-pager__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: var(--space-3);
}

.ranking-pager__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.ranking-pager__dot.is-active {
  background: var(--color-accent);
  transform: scale(1.4);
}
</style>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
