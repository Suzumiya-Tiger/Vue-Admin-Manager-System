import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 注册中国地图
import chinaJson from '../data/china.json'
echarts.registerMap('china', chinaJson as any)

export function useEcharts(domEl: HTMLElement) {
  // 1.初始化echarts实例，传入domEl用于渲染
  const echartInstance = echarts.init(domEl, 'light', {
    renderer: 'canvas'
  })

  // 设置options函数，使得options被外部调用，实现实例的options更新
  const setOption = (options: EChartsOption) => {
    echartInstance.setOption(options)
  }

  // 监听window尺寸的变化
  window.addEventListener('resize', () => {
    echartInstance.resize()
  })
  window.removeEventListener('resize', () => {
    echartInstance.resize()
  })
  return [setOption]
}
