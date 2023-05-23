// 引入创建路由的函数
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // 采用hash模式
  history: createWebHashHistory(),
  // 映射关系 path=>component
  routes: [
    // 配置默认路由
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      component: () => import('../view/login/Login.vue')
    },
    {
      path: '/main',
      component: () => import('../view/main/Main.vue')
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('../view/not-found/NotFound.vue')
    }
  ]
})

export default router
