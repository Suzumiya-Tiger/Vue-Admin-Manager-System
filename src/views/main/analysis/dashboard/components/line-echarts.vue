<template>
  <div ref="divRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import useEcharts from '@/hooks/useEcharts'
import type { lineDataOption } from '@/types/powerScreen/lineData'
interface IProps {
  lineData: lineDataOption
  width?: string
  height?: string
}

const props = defineProps<IProps>()
const lineDatas = ref(props.lineData)
// 获取div的DOM对象
const divRef = ref() as Ref<HTMLDivElement>
let myChart: {
  echartInstance: any
  setOption?: (option: any) => void
  resizeFn?: () => void
} | null = null
onMounted(() => {
  setupEchart(lineDatas.value)
  if (myChart && myChart.resizeFn) {
    window.addEventListener('resize', myChart.resizeFn)
  }
})
// 监听echartDatas的变化
watch(
  () => props.lineData,
  (newVal) => {
    setupEchart(newVal)
  },
  {
    deep: true
  }
)
function setupEchart(lineDatas: lineDataOption) {
  // 防止重复创建节点(在网络请求刷新数据的时候)
  if (!myChart) {
    myChart = useEcharts(divRef)
  }
  let computedOption = setOption(lineDatas)
  myChart.echartInstance.setOption(computedOption)
}
function setOption(lineDatas: lineDataOption) {
  const correctData = lineDatas.correctData
  const errorData = lineDatas.errorData
  let option = {
    // backgroundColor: 'rbg(40,46,72)',
    grid: {
      left: '5%',
      right: '1%',
      top: '22%',
      bottom: '20%',
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    legend: {
      right: 'center',
      bottom: '12%',
      itemGap: 20,
      itemWidth: 13,
      itemHeigth: 12,
      textStyle: {
        color: '#64BCFF'
      },
      icon: 'rect'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#20FF89'
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#64BCFF'
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          color: '#64BCFF'
        }
      }
    ],
    series: [
      {
        name: correctData.name,
        type: 'line',
        smooth: true,
        stack: '总量',
        symbolSize: 5,
        showSymbol: false,
        itemStyle: {
          color: '#20FF89',
          lineStyle: {
            color: '#20FF89',
            width: 2
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#20FF89'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        },
        data: correctData.data
      },
      {
        name: errorData.name,
        type: 'line',
        smooth: true,
        stack: '总量',
        symbolSize: 5,
        showSymbol: false,
        itemStyle: {
          color: '#EA9502',
          lineStyle: {
            color: '#EA9502',
            width: 2
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#EA9502'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          }
        },
        data: errorData.data
      }
    ]
  }
  return option
}
</script>
