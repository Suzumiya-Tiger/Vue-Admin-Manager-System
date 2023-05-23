// 引用创建pinia状态的函数
import { defineStore } from 'pinia'
// 指定输出对应属性/数据的pinia状态名称
const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 100
  }),
  getters: {
    doubleCounter(state) {
      return state.counter * state.counter
    }
  },
  actions: {
    changeCounterAction(newCounter: number) {
      this.counter = newCounter
    }
  }
})
export default useCounterStore
