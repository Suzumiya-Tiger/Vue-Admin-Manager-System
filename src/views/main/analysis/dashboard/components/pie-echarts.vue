<template>
  <div ref="divRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useEcharts from '@/hooks/useEcharts'
import type { pieData } from '@/types/powerScreen/pieData'
import type { Ref } from 'vue'
interface IProps {
  pieDatas: any[]
  width?: string
  height?: string
}

const props = defineProps<IProps>()

// 获取div的DOM对象
const divRef = ref() as Ref<HTMLDivElement>

let myChart: {
  echartInstance: any
  setOption?: (option: any) => void
  resizeFn?: () => void
} | null = null
onMounted(() => {
  setupEchart(props.pieDatas)
  if (myChart && myChart.resizeFn) {
    window.addEventListener('resize', myChart.resizeFn)
  }
})
// 监听echartDatas的变化
watch(
  () => props.pieDatas,
  (newVal) => {
    setupEchart(newVal)
  }
)
function setupEchart(pieDatas: pieData) {
  // 防止重复创建节点(在网络请求刷新数据的时候)
  if (!myChart) {
    myChart = useEcharts(divRef)
  }
  let computedOption = setOption(pieDatas)
  myChart.echartInstance.setOption(computedOption)
}
function setOption(pieDatas: pieData) {
  let data = pieDatas.map((item) => {
    return {
      value: item.value,
      name: item.station_name
    }
  })
  /*
    在你的代码中，total 是一个计算属性，
    而 TypeScript 在静态类型检查时，
    可能无法正确地捕获该计算属性的类型。
    为了解决这个问题，你可以将 total 放在 option 对象外面，
    并且使用一个中间变量来存储它。这样 TypeScript 就能够正确地捕获它的类型了。
  */
  let total = pieDatas.reduce((a, b) => {
    return a + b.value * 1
  }, 0)

  let option = {
    color: pieDatas.map((item) => {
      return item.color
    }),
    title: {
      text: `{nameSty| 充电桩总数}\n{number|${total}}`,
      top: '50%',
      left: '30%',
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 12,
            color: 'white',
            padding: [5, 0]
          },
          number: {
            fontSize: 14,
            color: 'white',
            padding: [4, 0, 0, 10]
          }
        }
      }
    },
    legend: {
      orient: 'vertical',
      right: '4%',
      top: '16%',
      itemGap: 16,
      itemWidth: 10,
      itemHeigth: 10,
      icon: 'rect',
      formatter: function (name: string) {
        let currentItem = pieDatas.find((item) => item.station_name === name)
        return (
          '{nameSty|' +
          currentItem?.station_name +
          '}\n' +
          '{numberSty|' +
          currentItem?.value +
          '个 }' +
          '{preSty|' +
          currentItem?.percentage +
          '}'
        )
      },
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 12,
            color: '#FFFFFF',
            padding: [10, 14]
          },
          numberSty: {
            fontSize: 12,
            color: '#40E6ff',
            padding: [0, 0, 0, 14]
          },
          preSty: {
            fontSize: 12,
            color: '#40E6ff'
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        center: ['40%', '57%'],
        radius: ['30%', '75%'],
        label: {
          show: false
        },
        data: data,
        roseType: 'area'
      }
    ]
  }
  return option
}
</script>
<style lang="less" scoped></style>
