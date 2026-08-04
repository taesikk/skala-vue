<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  statusOverride: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update-query'])

function onInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <span class="search-bar__glyph">🔍</span>
    <input
      class="search-bar__input"
      type="text"
      placeholder="검색할 도시 이름 입력"
      :value="searchQuery"
      @input="onInput"
    />
  </div>
  <p class="search-bar__status">
    <template v-if="statusOverride">{{ statusOverride }}</template>
    <template v-else> 검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong> </template>
  </p>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: var(--space-3) var(--space-4);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.search-bar__glyph {
  font-size: 0.9rem;
  opacity: 0.55;
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--color-text);
}

.search-bar__input::placeholder {
  color: var(--color-text-faint);
}

.search-bar__status {
  margin-top: var(--space-1);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
