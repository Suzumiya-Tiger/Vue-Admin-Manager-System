<template>
  <div class="right-top-panel">
    <!-- 1. 左边水球 -->
    <water-ball class="right-water-ball" :percentage="percentage"></water-ball>
    <!-- 2. 右边图例 -->
    <div class="legend">
      <template v-for="item in panelItems" :key="item">
        <div class="leg-name">
          <span :class="['dot', `area${item.id}`]"></span>
          <span class="name">{{ item.city_name }}</span>
          <span class="percentage">{{ item.percentage + '%' }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import WaterBall from './water-ball.vue'
import type { topOption } from '@/types/powerScreen/index'
interface IProps {
  percentage: number
  panelItems: topOption
}
const props = defineProps<IProps>()
</script>

<style scoped>
.right-top-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.right-top-panel .right-water-ball {
  width: 0.9844rem;
  height: 1.0365rem;
  margin-top: 0.1042rem;
  margin-left: 0.2083rem;
}

.right-top-panel .legend {
  flex: 1;
}
.right-top-panel .leg-name {
  margin-top: 0.1198rem;
  margin-left: 0.2083rem;
}
.right-top-panel .leg-name span {
  display: inline-block;
  font-size: 0.0833rem;
  margin-right: 0.0573rem;
}
.right-top-panel .legend .dot {
  width: 0.0885rem;
  height: 0.0885rem;
  border-radius: 50%;
}
.right-top-panel .legend .area1 {
  background-color: #209393;
}
.right-top-panel .legend .area2 {
  background-color: #1a54a5;
}
.right-top-panel .legend .area3 {
  background-color: #85caf0;
}
.right-top-panel .legend .area4 {
  background-color: #f5b64a;
}
.right-top-panel .legend .area5 {
  background-color: #ee792e;
}
.right-top-panel .legend .name {
  color: white;
}
.right-top-panel .legend .percentage {
  color: #0cd2ea;
}
</style>
