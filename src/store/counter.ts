// 引用创建pinia状态的函数
import { defineStore } from 'pinia'
// 指定输出对应属性/数据的pinia状态名称
// counter是pinia状态的名称，可以随意指定
const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 100
  }),
  // getters相当于vue中的computed计算属性，用于计算state中的数据
  getters: {
    doubleCounter(state) {
      return state.counter * state.counter
    }
  },
  // actions相当于vue中的methods方法，用于修改state中的数据
  actions: {
    // 可以在调用处直接使用useCounterStore.changeCounterAction(100)
    changeCounterAction(newCounter: number) {
      this.counter = newCounter
    }
  }
})
export default useCounterStore
