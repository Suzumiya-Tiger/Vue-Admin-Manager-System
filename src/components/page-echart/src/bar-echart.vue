<template>
  <div class="bar-echart">
    <BaseEchart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as echarts from 'echarts'
import BaseEchart from '@/components/echart/src/base-echart.vue'
import type { IEchartValueData } from '../types'
import type { EChartsOption } from 'echarts'
interface IProp {
  values: IEchartValueData[]
  labels: string[]
}
const props = defineProps<IProp>()

const option = computed<EChartsOption>(() => {
  return {
    title: {
      text: '分类商品销量'
    },
    grid: {
      bottom: '5%'
    },
    xAxis: {
      data: props.labels,
      axisLabel: {
        inside: true,
        color: '#fff'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'bar',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data: props.values
      }
    ]
  }
})
</script>

<style scoped></style>
../types
