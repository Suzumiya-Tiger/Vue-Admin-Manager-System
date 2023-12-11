<template>
  <div class="login" ref="Area">
    <div class="box-left first-box">
      <svg id="location" height="400" width="744">
        <desc>Created with Snap</desc>
        <defs>
          <linearGradient
            x1="100%"
            y1="40.7087699%"
            x2="4.9797314%"
            y2="60.8683027%"
            id="linearGradient-1"
          >
            <stop stop-color="#F5533D" stop-opacity="0" offset="0%"></stop>
            <stop stop-color="#F5533D" offset="44.5180532%"></stop>
            <stop stop-color="#F5533D" stop-opacity="0" offset="100%"></stop>
          </linearGradient>
        </defs>
        <image
          id="loc1"
          :href="getAssetsFile('login/redPoint.png')"
          preserveAspectRatio="none"
          x="280"
          y="100.275"
          width="55"
          height="74"
        ></image>
        <image
          id="loc2"
          :href="getAssetsFile('login/smPoint.png')"
          preserveAspectRatio="none"
          x="185"
          y="129.97776888888889"
          width="25"
          height="34"
        ></image>
        <image
          id="loc3"
          :href="getAssetsFile('login/smPoint.png')"
          preserveAspectRatio="none"
          x="385"
          y="120.35983743115371"
          width="25"
          height="34"
        ></image>
        <image
          :href="getAssetsFile('login/bg-red.png')"
          preserveAspectRatio="none"
          x="295"
          y="164"
          width="30"
          height="100"
        ></image>
        <image
          ::href="getAssetsFile('login/bg-red.png')"
          preserveAspectRatio="none"
          x="140"
          y="94"
          width="15"
          height="50"
        ></image>
        <image
          :href="getAssetsFile('login/first-smbg.png')"
          preserveAspectRatio="none"
          x="388"
          y="185"
          width="20"
          height="20"
        ></image>
        <ellipse
          id="c1"
          cx="310"
          cy="257"
          rx="8.106666666666667"
          ry="3.546666666666667"
          fill="rgba(0,0,0,0)"
          stroke="#ff0000"
          style="opacity: 0.493333"
        ></ellipse>
        <ellipse
          id="c2"
          cx="310"
          cy="257"
          rx="0"
          ry="0"
          fill="rgba(0,0,0,0)"
          stroke="#ff0000"
          style="opacity: 1"
        ></ellipse>
        <ellipse
          id="c3"
          cx="198"
          cy="190"
          rx="0"
          ry="0"
          fill="rgba(0,0,0,0)"
          stroke="#ff0000"
          style="opacity: 1"
        ></ellipse>
        <ellipse
          id="c4"
          cx="198"
          cy="190"
          rx="6.08"
          ry="2.5333333333333337"
          fill="rgba(0,0,0,0)"
          stroke="#ff0000"
          style="opacity: 0.493333"
        ></ellipse>
      </svg>
    </div>

    <login-panel class="panel" />
  </div>
</template>

<script setup lang="ts">
import LoginPanel from './c-cpns/login-panel.vue'
import { getAssetsFile } from '@/utils/pub-use'
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/login-bg.svg');
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.first-box {
  position: absolute;
  left: 1.5625rem;
  top: 1.0417rem;
  width: 3.6458rem;
  height: 2.1563rem;
  background: url('../../assets/images/login/bg-location.png');
  background-size: 100% 100%;
}
/* 椭圆 16-8 12-6 */
/* 定位 40-60,70-80 */
#loc1 {
  animation: moveLocIcon 2s linear infinite;
}
@keyframes moveLocIcon {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 0.2083rem);
  }
  100% {
    transform: translate(0, 0);
  }
}
#loc2,
#loc3 {
  animation: moveLocIcon2 2s linear infinite;
}
@keyframes moveLocIcon2 {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 0.0781rem);
  }
  100% {
    transform: translate(0, 0);
  }
}
#c1 {
  animation: scaleEllipse1 2s linear infinite;
}
#c2 {
  animation: scaleEllipse2 2s linear infinite;
  /* 动画延迟1s才开始运行 */
  animation-delay: 0.2s;
}
#c3 {
  animation: scaleEllipse3 2s linear infinite;
}
#c4 {
  animation: scaleEllipse4 2s linear infinite;
  /* 动画延迟1s才开始运行 */
  animation-delay: 0.2s;
}
@keyframes scaleEllipse1 {
  0% {
    rx: 0;
    ry: 0;
    opacity: 1;
  }
  100% {
    rx: 16;
    ry: 8;
    opacity: 0;
  }
}
@keyframes scaleEllipse2 {
  0% {
    rx: 0;
    ry: 0;
    opacity: 1;
  }

  100% {
    rx: 12;
    ry: 6;
    opacity: 0;
  }
}
@keyframes scaleEllipse3 {
  0% {
    rx: 0;
    ry: 0;
    opacity: 1;
  }

  100% {
    rx: 10;
    ry: 6;
    opacity: 0;
  }
}
@keyframes scaleEllipse4 {
  0% {
    rx: 0;
    ry: 0;
    opacity: 1;
  }

  100% {
    rx: 8;
    ry: 4;
    opacity: 0;
  }
}
</style>
