<!--
  로그인/회원가입 입력 폼.
  mode prop(login/signup)에 따라 보여줄 필드를 바꾸고, 제출 시
  입력값을 부모 컴포넌트로 emit한다.
-->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['submit'])

const name = ref('')
const email = ref('')
const password = ref('')

watch(
  () => props.mode,
  () => {
    name.value = ''
    email.value = ''
    password.value = ''
  },
)

function onSubmit() {
  const payload =
    props.mode === 'signup'
      ? { name: name.value, email: email.value, password: password.value }
      : { email: email.value, password: password.value }
  emit('submit', payload)
}
</script>

<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <div v-if="mode === 'signup'" class="auth-form__field">
      <label for="auth-name">이름</label>
      <input id="auth-name" v-model="name" type="text" placeholder="홍길동" required />
    </div>

    <div class="auth-form__field">
      <label for="auth-email">이메일</label>
      <input id="auth-email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>

    <div class="auth-form__field">
      <label for="auth-password">비밀번호</label>
      <input
        id="auth-password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        required
        minlength="4"
      />
    </div>

    <p v-if="errorMessage" class="auth-form__error">⚠️ {{ errorMessage }}</p>

    <button class="auth-form__submit" type="submit" :disabled="loading">
      {{ loading ? '처리 중...' : mode === 'signup' ? '회원가입' : '로그인' }}
    </button>
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-form__field label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.auth-form__field input {
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  border-radius: var(--radius-pill);
  padding: 10px 16px;
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.auth-form__field input::placeholder {
  color: var(--color-text-faint);
}

.auth-form__field input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.auth-form__error {
  font-size: 0.82rem;
  color: var(--color-warm);
  background: var(--color-warm-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
}

.auth-form__submit {
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

.auth-form__submit:hover:not(:disabled) {
  opacity: 0.85;
}

.auth-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
