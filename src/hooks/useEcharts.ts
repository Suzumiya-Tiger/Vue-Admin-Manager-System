/**
 * 管理echarts实例
 *
 * 1.初始化echarts实例
 * 2.控制实例的创建和销毁
 * 3.控制option的设置
 * 4.控制echarts的resize(响应式)
 */
import _ from 'lodash'
import { onUnmounted, onMounted, type Ref } from 'vue'
import * as echarts from 'echarts'
// 如果你的 divEl 实际上是一个 Ref<HTMLDivElement>（来自 Vue 的 ref），
// 那么你需要使用.value 属性来获取实际的 HTMLDivElement 对象。
// 在这种情况下，你的函数签名应该是这样的：divEl: Ref<HTMLDivElement>

/**
 *
 * @param divEl
 *  Ref<HTMLDivElement>，意味着它是一个由 ref 创建的引用，
 * 它的 .value 属性应该是一个 HTMLDivElement。
 * 这样的类型定义有助于开发者使用 divEl 时，能够明确地知道它是一个包含 HTMLDivElement 的引用。
 *
 * 这种做法的好处在于，它使得在 Vue 组件中使用 divEl 时，
 * 开发者能够充分利用 Vue 的响应式系统，
 * 确保对 divEl 值的更改能够被追踪和触发组件重新渲染。
 * 而 Ref<HTMLDivElement> 类型的定义则提供了对这一结构的静态类型检查，
 * 帮助开发者在编码过程中发现潜在的错误。
 */

export default function useEcharts(divEl: Ref<HTMLDivElement>) {
  const echartInstance = echarts.init(divEl.value, { render: 'canvas' })

  const setOption = (option: any) => {
    echartInstance.setOption(option)
  }
  const resizeEcharts = () => {
    echartInstance.resize()
  }
  const resizeFn = _.throttle(resizeEcharts, 100)

  // 释放资源
  onUnmounted(() => {
    window.removeEventListener('resize', resizeFn)
    // 销毁实例
    echartInstance.dispose()
  })

  return {
    echartInstance,
    setOption,
    resizeFn
  }
}
