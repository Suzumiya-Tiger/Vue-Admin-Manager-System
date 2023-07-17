// 在一个总的出口文件之中导出createPinia函数用于创建pinia
import { createPinia } from 'pinia'
import type { App } from 'vue'
import useLoginStore from './login/login'

const pinia = createPinia()
/* 通过在main.ts的入口文件里面注册该store，使得加载入口文件时，对应的检测是否登录逻辑也一起生效 */
function registerStore(app: App<Element>) {
  // 1.利用引入的Vue实例app.use(pinia)来注册pinia
  app.use(pinia)
  // 2.加载本地的数据
  // loadLocalCacheAction的调用是为了确保在已登录的情况下，
  // 刷新页面时，依然可以得到根据用户权限获取的路由映射表
  const loginStore = useLoginStore()
  loginStore.loadLocalCacheAction()
}

export default registerStore
