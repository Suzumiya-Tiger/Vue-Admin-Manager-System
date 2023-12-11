<template>
  <div ref="divRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import useEcharts from '@/hooks/useEcharts'
import type { barDataOption } from '@/types/powerScreen/barData'
interface IProps {
  barData: barDataOption
  width?: string
  height?: string
}

const props = defineProps<IProps>()
// 获取div的DOM对象
const divRef = ref() as Ref<HTMLDivElement>
let myChart: {
  echartInstance: any
  setOption?: (option: any) => void
  resizeEcharts?: () => void
} | null = null
onMounted(() => {
  setupEchart(props.barData)
})
// 监听echartDatas的变化
watch(
  () => props.barData,
  (newVal) => {
    setupEchart(newVal)
  }
)

function setupEchart(barDatas: barDataOption) {
  // 防止重复创建节点(在网络请求刷新数据的时候)
  if (!myChart && divRef.value) {
    myChart = useEcharts(divRef)
  }
  if (myChart) {
    let computedOption = setOption(barDatas)
    myChart.echartInstance.setOption(computedOption)
  }
}
function setOption(barDatas: barDataOption) {
  const barArr = barDatas
  let category = barArr.map((item) => {
    return item.month_name
  })
  let values = barArr.map((item) => {
    return item.value
  })
  let option = {
    // backgroundColor: 'rbg(40,46,72)',
    grid: {
      left: '5%',
      right: '5%',
      top: '28%',
      bottom: '4%',
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    tooltip: {},
    xAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#42A4FF'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'white'
      },

      data: category
    },
    yAxis: {
      name: '个',
      nameTextStyle: {
        color: 'white',
        fontSize: 13
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#42A4FF'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#42A4FF'
        }
      },
      axisLabel: {
        color: 'white'
      }
    },
    series: [
      {
        name: '充电数据统计',
        type: 'bar',
        barWidth: 17,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#01B1FF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#033BFF' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        data: values
      }
    ]
  }

  return option
}
</script>
