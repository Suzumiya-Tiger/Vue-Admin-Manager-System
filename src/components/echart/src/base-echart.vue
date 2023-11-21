<template>
  <div class="base-echart">
    <div class="echart" ref="echartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useEcharts } from '../hooks/useEcharts'
import type { EChartsOption } from 'echarts'

interface IProps {
  option: EChartsOption
  width?: string
  height?: string
}
const props = withDefaults(defineProps<IProps>(), {
  options: () => ({}),
  width: '100%',
  height: '40vh'
})
const echartRef = ref<HTMLElement>()
onMounted(() => {
  const [setOption] = useEcharts(echartRef.value!)

  // watchEffect会自动追踪数据更新，当依赖发生变化时，会自动执行回调函数
  watchEffect(() => {
    // 2.为echarts实例设置options(配置项)
    setOption(props.option)
  })
})
</script>

<style lang="less" scoped>
.base-echart {
  .echart {
    height: 45vh;
  }
}
</style>
