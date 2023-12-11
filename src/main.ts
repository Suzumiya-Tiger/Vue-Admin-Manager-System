import { createApp } from 'vue'
import 'default-passive-events'
// 公用的基础css文件
import 'normalize.css'
import './assets/css/index.less'
import '@/utils/flexible'

// 需要在env.d.ts中声明vue是一个模块组件
import App from './App.vue'
import router from './router'
import icons from './global/regitster-icons'
// pinia也必须要app进行注册才能在vue中使用
import store from './store'
const app = createApp(App)

app.use(icons)
// 刷新获取路由映射表(已授权情况下)应该建立在pinia的架构创建之后,所以这里统一封装到store的出口文件之中
/* 这里有一点必须要注意，路由的注入/注册不依赖于app.use(router)是否建立
   但是！app.use(router)如果先一步执行，建设出来的路由映射表只有静态路由，
   所以应该先注册路由，再执行app.use(router)
*/
app.use(store)
// 在路由全部注册完毕之后再加载router,防止在main页面刷新时路由守卫失效
// 在login页面登录的时候，app.use(router)的执行顺序并不重要，因为login页面并没有路由守卫，
// 也用不上对应的路由映射表，所以不会出现路由守卫失效的情况
app.use(router)
app.mount('#app')

// 针对ElMessage和ElLoading等组件引入样式
/* 部分引入或者全局引入不合理，所以只需直接在vite.config.ts中配置vite-plugin-style-import 即可实现样式库的按需引入 */
