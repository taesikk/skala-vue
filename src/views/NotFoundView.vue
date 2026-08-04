<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page-container">
    <section class="not-found">
      <p class="not-found__emoji">🌤️❓</p>
      <h2 class="not-found__title">페이지를 찾을 수 없습니다.</h2>
      <p class="not-found__desc">요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
      <button class="not-found__btn" type="button" @click="goHome">날씨 메인으로 이동</button>
    </section>
  </div>
</template>

<style scoped>
.not-found {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 64px var(--space-6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  animation: fade-up 0.5s var(--ease-out) both;
}

.not-found__emoji {
  font-size: 3rem;
  margin-bottom: var(--space-2);
}

.not-found__title {
  font-size: 1.15rem;
  font-weight: 800;
}

.not-found__desc {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-2);
}

.not-found__btn {
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.not-found__btn:hover {
  opacity: 0.85;
}

.not-found__btn:active {
  transform: scale(0.98);
}
</style>
