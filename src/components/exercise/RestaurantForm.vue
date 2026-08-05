<!--
  나만의 맛집 추가 입력 폼.
  6개 필드를 reactive 객체로 관리하고, 제출 시 상위로 emit한 뒤 폼을 초기화한다.
-->
<script setup>
import { reactive } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  region: '',
  category: '',
  address: '',
  rating: 5,
  memo: '',
})

function setRating(value) {
  form.rating = value
}

function onSubmit() {
  emit('submit', { ...form })
  form.name = ''
  form.region = ''
  form.category = ''
  form.address = ''
  form.rating = 5
  form.memo = ''
}
</script>

<template>
  <form class="restaurant-form" @submit.prevent="onSubmit">
    <div class="restaurant-form__row">
      <div class="restaurant-form__field">
        <label for="r-name">가게 이름</label>
        <input id="r-name" v-model="form.name" type="text" placeholder="예: 톤쇼우" required />
      </div>
      <div class="restaurant-form__field">
        <label for="r-region">지역</label>
        <input id="r-region" v-model="form.region" type="text" placeholder="예: 부산" required />
      </div>
    </div>

    <div class="restaurant-form__row">
      <div class="restaurant-form__field">
        <label for="r-category">음식 종류</label>
        <input id="r-category" v-model="form.category" type="text" placeholder="예: 일식" required />
      </div>
      <div class="restaurant-form__field">
        <label>별점</label>
        <div class="restaurant-form__stars">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="restaurant-form__star"
            :class="{ 'is-filled': n <= form.rating }"
            @click="setRating(n)"
          >
            ★
          </button>
        </div>
      </div>
    </div>

    <div class="restaurant-form__field">
      <label for="r-address">주소</label>
      <input
        id="r-address"
        v-model="form.address"
        type="text"
        placeholder="예: 부산 금정구 금강로 247-10"
        required
      />
    </div>

    <div class="restaurant-form__field">
      <label for="r-memo">메모</label>
      <textarea id="r-memo" v-model="form.memo" rows="2" placeholder="방문 후기나 추천 이유를 적어보세요"></textarea>
    </div>

    <button class="restaurant-form__submit" type="submit" :disabled="loading">
      {{ loading ? '등록 중...' : '맛집 추가' }}
    </button>
  </form>
</template>

<style scoped>
.restaurant-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.restaurant-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.restaurant-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.restaurant-form__field label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.restaurant-form__field input,
.restaurant-form__field textarea {
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  font-family: inherit;
  resize: vertical;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.restaurant-form__field input::placeholder,
.restaurant-form__field textarea::placeholder {
  color: var(--color-text-faint);
}

.restaurant-form__field input:focus,
.restaurant-form__field textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.restaurant-form__stars {
  display: flex;
  gap: 2px;
  padding: 8px 0;
}

.restaurant-form__star {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  line-height: 1;
  color: var(--color-border);
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.restaurant-form__star.is-filled {
  color: var(--color-warm);
}

.restaurant-form__submit {
  margin-top: var(--space-1);
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.restaurant-form__submit:hover:not(:disabled) {
  opacity: 0.85;
}

.restaurant-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
