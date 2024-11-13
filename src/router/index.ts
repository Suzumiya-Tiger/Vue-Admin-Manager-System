// 引入创建路由的函数
import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { LOGIN_TOKEN } from '@/global/constants'
import { firstMenu } from '@/utils/map-menus'

import { withLoading } from '@/hooks/withLoading'
const router = createRouter({
  // 采用hash模式
  history: createWebHashHistory(),
  // 映射关系 path=>component
  routes: [
    // 配置默认路由
    // 这里需要利用路由导航守卫判断用户是否登录
    {
      path: '/',
      // 默认路径重定向到/main
      redirect: '/main'
    },
    {
      path: '/login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/main/main.vue'),
      children: []
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('../views/not-found/NotFound.vue')
    }
  ]
})

// 导航守卫
// 参数：to(跳转到的位置)/from(从哪里跳转过来)
// 返回值：决定导航的路径（不返回或者返回undefined，默认跳转）
router.beforeEach((to, from) => {
  const token = localCache.getCache(LOGIN_TOKEN)

  if (to.path.startsWith('/main') && !token) {
    // 如果没有 token，重定向到登录页面
    return '/login'
  }
  if (to.path === '/main') {
    return firstMenu?.url || '/main/analysis/overview'
  }
  if (to.path === '/login' && token) {
    // 如果已经有 token，却访问登录页面，重定向到主页面
    return firstMenu?.url || '/main'
  }
})

export default router
