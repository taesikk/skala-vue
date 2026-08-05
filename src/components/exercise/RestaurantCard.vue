<script setup>
import { computed } from 'vue'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const starDisplay = computed(() => '★'.repeat(props.restaurant.rating) + '☆'.repeat(5 - props.restaurant.rating))

function handleDelete() {
  emit('delete', props.restaurant.id)
}
</script>

<template>
  <article class="restaurant-card">
    <div class="restaurant-card__main">
      <p class="restaurant-card__name">{{ restaurant.name }}</p>
      <p class="restaurant-card__meta">{{ restaurant.category }} · {{ restaurant.region }}</p>
      <p class="restaurant-card__address">{{ restaurant.address }}</p>
      <p class="restaurant-card__rating">{{ starDisplay }}</p>
      <p v-if="restaurant.memo" class="restaurant-card__memo">{{ restaurant.memo }}</p>
    </div>
    <button class="restaurant-card__delete-btn" type="button" @click="handleDelete">삭제</button>
  </article>
</template>

<style scoped>
.restaurant-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.restaurant-card__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.restaurant-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}

.restaurant-card__meta {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-weight: 600;
}

.restaurant-card__address {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.restaurant-card__rating {
  font-size: 0.85rem;
  color: var(--color-warm);
  letter-spacing: 1px;
}

.restaurant-card__memo {
  margin-top: 2px;
  font-size: 0.82rem;
  color: var(--color-text-faint);
}

.restaurant-card__delete-btn {
  flex-shrink: 0;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-warm);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.restaurant-card__delete-btn:hover {
  background: var(--color-warm);
  color: white;
}
</style>
