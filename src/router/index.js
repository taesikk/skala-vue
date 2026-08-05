// Vue Router 설정.
// GitHub Pages 배포를 고려해 해시 기반 히스토리를 사용하며,
// 각 탭의 라우트와 지연 로딩(lazy import) 컴포넌트를 정의한다.

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/restaurants',
      name: 'national-restaurants',
      component: () => import('../views/RestaurantsView.vue'),
    },
    {
      path: '/camping',
      name: 'camping',
      component: () => import('../views/CampingView.vue'),
    },
    {
      path: '/top',
      name: 'top',
      component: () => import('../views/TopView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
