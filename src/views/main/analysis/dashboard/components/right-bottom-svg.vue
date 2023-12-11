<template>
  <svg
    id="yichang"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="406"
    height="127"
    viewBox="0 0 456 127"
  >
    <defs>
      <linearGradient
        id="hy-linear-gradient"
        x1="432"
        y1="61.625"
        x2="2"
        y2="61.625"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#26cadd" />
        <stop offset="0.301" stop-color="#26a3ff" />
        <stop offset="0.624" stop-color="#26cadd" />
        <stop offset="0.994" stop-color="#26a3ff" />
        <stop offset="1" stop-color="#26a3ff" />
      </linearGradient>
      <linearGradient
        id="hy-linear-gradient-2"
        x1="432"
        y1="61.625"
        x2="2"
        y2="61.625"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#2b6bdc" />
        <stop offset="0.031" stop-color="#2b6bdc" />
        <stop offset="0.597" stop-color="#2bdcd2" />
        <stop offset="1" stop-color="#2b6bdc" />
      </linearGradient>
      <!-- 只需要模糊的效果，对应的原坐标轴直接删除即可 -->
      <filter id="hy-filter" filterUnits="userSpaceOnUse">
        <feGaussianBlur result="blur" stdDeviation="6.667" in="SourceAlpha" />
        <feComposite result="composite" />
        <feComposite result="composite-2" />
        <feComposite result="composite-3" />
        <feFlood result="flood" flood-color="#f98800" flood-opacity="0.6" />
        <feComposite result="composite-4" operator="in" in2="composite-3" />
        <feBlend result="blend" in2="SourceGraphic" />
        <feBlend result="blend-2" in="SourceGraphic" />
      </filter>
      <filter
        id="hy-filter-2"
        x="67"
        y="-6"
        width="50"
        height="49"
        filterUnits="userSpaceOnUse"
      >
        <feGaussianBlur result="blur" stdDeviation="6.667" in="SourceAlpha" />
        <feComposite result="composite" />
        <feComposite result="composite-2" />
        <feComposite result="composite-3" />
        <feFlood result="flood" flood-color="#f98800" flood-opacity="0.6" />
        <feComposite result="composite-4" operator="in" in2="composite-3" />
        <feBlend result="blend" in2="SourceGraphic" />
        <feBlend result="blend-2" in="SourceGraphic" />
      </filter>
    </defs>
    <path
      id="curve_right"
      class="hy-cls-1"
      d="M2.006,86.083H31.461l3.006-9.664,4.208,13.288,4.208-10.268,3.006,6.644H73.541l4.208-10.872L83.76,103l7.871-82.748,10.163,71.876,3.607-6.644h11.421l3.607,13.892L124.637,72.8l5.41,20.536,3.006-7.852h46.888l4.208-15.7,6.011,28.388,5.41-19.932,4.208,7.248h37.815L241,76l4,14,5-11,3,6h27l4-11,6,29,10-69,8,57,3-6h13l3,14,4-27,6,20,2-7h46l6-16,5,29,7-20,4,7h25"
    />
    <path
      id="curve"
      class="hy-cls-2"
      d="M2.006,86.083H31.461l3.006-9.664,4.208,13.288,4.208-10.268,3.006,6.644H73.541l4.208-10.872L83.76,103l7.871-82.748,10.163,71.876,3.607-6.644h11.421l3.607,13.892L124.637,72.8l5.41,20.536,3.006-7.852h46.888l4.208-15.7,6.011,28.388,5.41-19.932,4.208,7.248h37.815L241,76l4,14,5-11,3,6h27l4-11,6,29,10-69,8,57,3-6h13l3,14,4-27,6,20,2-7h46l6-16,5,29,7-20,4,7h25"
    />
    <template v-for="item in dotData" :key="item">
      <circle class="hy-cls-3" cx="0" cy="0" :r="item.value">
        <!-- dur:持续时间 repeat-count:重复方式 rotate:"自动转向" -->
        <animateMotion
          :dur="item.duration"
          repeatCount="indefinite"
          rotate="auto"
          :begin="item.begin_time"
        >
          <!-- 指定追随轨迹的路径 -->
          <mpath href="#curve"></mpath>
        </animateMotion>
      </circle>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { IDots } from '@/types/powerScreen/dotData'
interface IProps {
  dots: IDots
}
const props = defineProps<IProps>()
const dotData = ref(props.dots)

watchEffect(() => {
  dotData.value = props.dots
})
</script>

<style scoped>
.hy-cls-1,
.hy-cls-2 {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4px;
  fill-rule: evenodd;
}

.hy-cls-1 {
  opacity: 0.8;
  stroke: url(#hy-linear-gradient);
}

.hy-cls-2 {
  stroke: url(#hy-linear-gradient-2);
}

.hy-cls-3,
.hy-cls-4 {
  fill: #f98800;
  /* 告诉浏览器该元素准备会改变哪些属性 */
  /* 使得浏览器提前做好优化的准备(消耗电脑内存) */
  will-change: opacity;
}

.hy-cls-3 {
  filter: url(#hy-filter);
}

.hy-cls-4 {
  filter: url(#hy-filter-2);
}
</style>
