// 引入创建路由的函数
import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { LOGIN_TOKEN } from '@/global/constants'

const router = createRouter({
  // 采用hash模式
  history: createWebHashHistory(),
  // 映射关系 path=>component
  routes: [
    // 配置默认路由
    // 这里需要利用路由导航守卫判断用户是否登录
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

// 导航守卫
// 参数：to(跳转到的位置)/from(从哪里跳转过来)
// 返回值：决定导航的路径（不反悔活着返回undefined，默认跳转）
router.beforeEach((to, from) => {
  const token = localCache.getCache(LOGIN_TOKEN)

  if (to.path === '/main' && !token) {
    // 只有拥有token，才能正常进入main
    return '/login'
  }
})
export default router
