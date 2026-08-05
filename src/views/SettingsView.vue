<!--
  로그인 탭.
  mock 로그인/회원가입 폼을 보여주고, 로그인 상태면 프로필 카드와
  로그아웃 버튼을 보여준다.
-->
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { mockLogin, mockSignup } from '@/services/mockAuthApi'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import AuthForm from '@/components/exercise/AuthForm.vue'

const authStore = useAuthStore()

const mode = ref('login')
const isSubmitting = ref(false)
const errorMessage = ref(null)

function switchMode(next) {
  mode.value = next
  errorMessage.value = null
}

async function handleSubmit(payload) {
  isSubmitting.value = true
  errorMessage.value = null
  try {
    const user = mode.value === 'signup' ? await mockSignup(payload) : await mockLogin(payload)
    authStore.login(user)
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.message || err?.message || '요청 처리 중 오류가 발생했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <BaseDashboardCard :title="authStore.isLoggedIn ? '내 정보' : '로그인'" icon="⚙️">
      <Transition name="fade" mode="out-in">
        <div v-if="authStore.isLoggedIn" key="profile" class="profile">
          <div class="profile__row">
            <span class="profile__avatar">{{ authStore.currentUser.name.charAt(0) }}</span>
            <div>
              <p class="profile__name">{{ authStore.currentUser.name }}</p>
              <p class="profile__email">{{ authStore.currentUser.email }}</p>
            </div>
          </div>
          <button class="logout-btn" type="button" @click="authStore.logout">로그아웃</button>
        </div>

        <div v-else key="form">
          <div class="mode-switch">
            <span
              class="mode-switch__thumb"
              :class="{ 'mode-switch__thumb--right': mode === 'signup' }"
            ></span>
            <button
              type="button"
              class="mode-switch__option"
              :class="{ 'is-active': mode === 'login' }"
              @click="switchMode('login')"
            >
              로그인
            </button>
            <button
              type="button"
              class="mode-switch__option"
              :class="{ 'is-active': mode === 'signup' }"
              @click="switchMode('signup')"
            >
              회원가입
            </button>
          </div>

          <AuthForm :mode="mode" :loading="isSubmitting" :error-message="errorMessage" @submit="handleSubmit" />

          <p class="hint">
            <template v-if="mode === 'login'">
              테스트 계정: <strong>Sincere@april.biz</strong> (비밀번호는 아무거나)
            </template>
            <template v-else> 실제 서버에 저장되지 않는 목업이에요. 이 브라우저에만 남습니다. </template>
          </p>
        </div>
      </Transition>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.mode-switch {
  position: relative;
  display: flex;
  width: 100%;
  padding: 3px;
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
}

.mode-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  transition: transform 0.28s var(--ease-out);
}

.mode-switch__thumb--right {
  transform: translateX(100%);
}

.mode-switch__option {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 9px 0;
  border: none;
  background: transparent;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.mode-switch__option.is-active {
  color: var(--color-surface);
}

.hint {
  margin-top: var(--space-3);
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-faint);
}

.profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.profile__row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.profile__avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 1.3rem;
  font-weight: 800;
}

.profile__name {
  font-weight: 800;
  font-size: 1rem;
}

.profile__email {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.logout-btn {
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

.logout-btn:hover {
  opacity: 0.85;
}
</style>
