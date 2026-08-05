<!--
  헤더 상단의 유리질감(glassmorphism) 탭 네비게이션 메뉴.
  홈/전국맛집/캠핑/Top/로그인 5개 탭으로 이동하는 라우터 링크를 보여준다.
-->
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- From Uiverse.io by mymiamo (색상/사이즈를 헤더 인라인용으로 각색) -->
  <nav class="menu">
    <RouterLink to="/" active-class="active" exact-active-class="active" title="홈">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
        ></path>
        <path
          d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
        ></path>
      </svg>
      <span>홈</span>
    </RouterLink>

    <RouterLink to="/restaurants" active-class="active" exact-active-class="active" title="전국 맛집">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span>전국 맛집</span>
    </RouterLink>

    <RouterLink to="/camping" active-class="active" exact-active-class="active" title="캠핑">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5 22 20.5H2L12 2.5Zm0 4.33-6.02 10.9h3.2L12 12l2.82 5.73h3.2L12 6.83Z"></path>
      </svg>
      <span>캠핑</span>
    </RouterLink>

    <RouterLink to="/top" active-class="active" exact-active-class="active" title="Top">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="10" width="5" height="11" rx="1"></rect>
        <rect x="9.5" y="5" width="5" height="16" rx="1"></rect>
        <rect x="16" y="13" width="5" height="8" rx="1"></rect>
      </svg>
      <span>Top</span>
    </RouterLink>

    <RouterLink to="/settings" active-class="active" exact-active-class="active" title="로그인">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z"
        ></path>
        <path
          fill-rule="evenodd"
          d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span>로그인</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
/* From Uiverse.io by mymiamo (헤더 인라인용 + 다른 토글과 높이를 맞춘 각색) */
.menu {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  height: 32px;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  border-radius: 999px;
  backdrop-filter: blur(12px) saturate(180%) contrast(120%);
  -webkit-backdrop-filter: blur(12px) saturate(180%) contrast(120%);
  background: rgba(124, 92, 240, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.menu a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 100%;
  padding: 0 10px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu a:hover {
  background-color: rgba(255, 255, 255, 0.22);
}

.menu a svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.menu a span {
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
}

.menu a.active {
  background: var(--color-surface);
  color: var(--color-accent);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.menu a:active {
  transform: scale(0.96);
}

.menu::-webkit-scrollbar {
  display: none;
}
</style>
