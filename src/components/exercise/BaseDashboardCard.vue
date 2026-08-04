<script setup>
defineProps({
  icon: {
    type: String,
    default: '📋',
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="dashboard-card">
    <header class="dashboard-card__header">
      <span class="dashboard-card__icon">{{ icon }}</span>
      <h2 class="dashboard-card__title">{{ title }}</h2>
    </header>
    <div class="dashboard-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.dashboard-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  animation: fade-up 0.5s var(--ease-out) both;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.dashboard-card:hover {
  box-shadow: var(--shadow-md);
}

.dashboard-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.dashboard-card__icon {
  font-size: 1.1rem;
  line-height: 1;
}

.dashboard-card__title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}

.dashboard-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
