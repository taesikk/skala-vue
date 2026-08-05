// 로그인 세션을 관리하는 Pinia 스토어.
// 현재 로그인한 사용자 정보를 localStorage에 영속화해 새로고침 후에도 유지한다.

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'mock-auth-current-user'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(readStoredUser())

  const isLoggedIn = computed(() => !!currentUser.value)

  function login(user) {
    currentUser.value = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { currentUser, isLoggedIn, login, logout }
})
