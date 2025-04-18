// 引入创建路由的函数
import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { CURRENT_ROUTE, LOGIN_TOKEN } from '@/global/constants'
import { firstMenu } from '@/utils/map-menus'
import useLoginStore from '@/store/login'

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

// 添加一个标志位来跟踪是否已经加载动态路由
let dynamicRoutesAdded = false

// 导航守卫
// 参数：to(跳转到的位置)/from(从哪里跳转过来)
// 返回值：决定导航的路径（不返回或者返回undefined，默认跳转）
router.beforeEach(async (to, from) => {
  // 1. 检查token
  const token = localCache.getCache(LOGIN_TOKEN)

  // 2. 没有token且访问主页相关路由，重定向到登录页
  if (to.path.startsWith('/main') && !token) {
    return '/login'
  }

  // 3. 有token的情况
  if (token) {
    // 3.1 加载动态路由(仅在首次导航/刷新后)
    const loginStore = useLoginStore()

    // 如果是刷新后的第一次导航或还没有加载动态路由
    if (!dynamicRoutesAdded) {
      try {
        // 标记避免重复加载
        dynamicRoutesAdded = true

        // 加载用户数据并注册动态路由
        await loginStore.loadLocalCacheAction()

        // 刷新时，如果是访问/main下的子路由且没有匹配到已知路由
        if (to.path.startsWith('/main/') && to.matched.length < 2) {
          // 重新导航，这时动态路由已添加，应该能正确匹配
          return { path: to.fullPath, replace: true, force: true }
        }
      } catch (error) {
        console.error('动态路由加载失败:', error)
        return '/login'
      }
    }

    // 3.2 登录后访问登录页，重定向到主页
    if (to.path === '/login') {
      return firstMenu?.url || '/main'
    }

    // 3.3 访问/main根路径，重定向到第一个菜单
    if (to.path === '/main') {
      if (firstMenu?.url) {
        return firstMenu.url
      } else {
        return '/main/analysis/overview'
      }
    }

    // 3.4 保存当前路由，用于刷新恢复
    localCache.setCache(CURRENT_ROUTE, to.path)
  }

  return true
})

export default router
