<template>
  <div class="line-echart">
    <BaseEchart :option="option" />
  </div>
</template>

<script setup lang="ts">
import BaseEchart from '@/components/echart/src/base-echart.vue'
import type { EChartsOption } from 'echarts'
import type { IEchartValueData } from '../types'
import { computed } from 'vue'

interface IProp {
  values: IEchartValueData[]
  labels: string[]
}
const props = defineProps<IProp>()
const option = computed<EChartsOption>(() => {
  return {
    title: {
      text: '分类商品收藏量'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.labels
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        stack: 'Total',
        data: props.values
      }
    ]
  }
})
</script>

<style lang="less" scoped>
.line-echart {
}
</style>
../types
