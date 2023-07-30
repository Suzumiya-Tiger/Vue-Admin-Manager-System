<template>
  <div class="rose-echart">
    <BaseEchart :option="option" />
  </div>
</template>

<script setup lang="ts">
import BaseEchart from '@/components/echart/src/base-echart.vue'
import type { EChartsOption } from 'echarts'
import type { IEchartValueType } from '../types'
import { computed } from 'vue'
interface IProps {
  roseData: IEchartValueType[]
}
const props = defineProps<IProps>()
const option = computed<EChartsOption>(() => {
  return {
    title: {
      text: 'Nightingale Chart',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      top: 'bottom',
      data: [
        'rose1',
        'rose2',
        'rose3',
        'rose4',
        'rose5',
        'rose6',
        'rose7',
        'rose8'
      ]
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Radius Mode',
        type: 'pie',
        radius: [20, 140],
        center: ['25%', '50%'],
        bottom: '-15%',
        roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: props.roseData
      }
    ]
  }
})
</script>

<style lang="less" scoped>
.rose-echart {
}
</style>
../types
