<template>
  <div class="hourglass-loader">
    <div class="hourglass">
      <span class="hourglass__top"></span>
      <span class="hourglass__bottom"></span>
      <span class="hourglass__neck"></span>
      <span class="hourglass__grain hourglass__grain--1"></span>
      <span class="hourglass__grain hourglass__grain--2"></span>
      <span class="hourglass__grain hourglass__grain--3"></span>
    </div>
    <p class="hourglass-loader__text">
      날씨 정보를 불러오는 중
      <span class="hourglass-loader__dots">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </p>
  </div>
</template>

<style scoped>
.hourglass-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.hourglass {
  position: relative;
  width: 46px;
  height: 58px;
  animation: hgFlip 2.7s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  transform-origin: 50% 50%;
}

.hourglass__top,
.hourglass__bottom {
  position: absolute;
  left: 0;
  width: 46px;
  height: 27px;
}

.hourglass__top {
  top: 0;
  background: var(--gradient-sunny);
  clip-path: polygon(6% 0, 94% 0, 50% 96%);
}

.hourglass__bottom {
  bottom: 0;
  background: linear-gradient(200deg, #ff9a56 0%, #ea580c 100%);
  clip-path: polygon(50% 4%, 94% 100%, 6% 100%);
}

.hourglass__neck {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fde68a;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px rgba(234, 88, 12, 0.5);
}

.hourglass__grain {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: #fff7ed;
  opacity: 0;
  animation: hgGrain 0.9s linear infinite;
}

.hourglass__grain--1 {
  animation-delay: 0s;
}
.hourglass__grain--2 {
  animation-delay: 0.3s;
}
.hourglass__grain--3 {
  animation-delay: 0.6s;
}

@keyframes hgFlip {
  0%,
  38% {
    transform: rotate(0deg);
  }
  50%,
  88% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes hgGrain {
  0% {
    top: 10px;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: 46px;
    opacity: 0;
  }
}

.hourglass-loader__text {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.hourglass-loader__dots {
  display: inline-flex;
  gap: 2px;
}

.hourglass-loader__dots span {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-faint);
  animation: hgDotBlink 1.2s ease-in-out infinite;
}

.hourglass-loader__dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.hourglass-loader__dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes hgDotBlink {
  0%,
  80%,
  100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}
</style>
