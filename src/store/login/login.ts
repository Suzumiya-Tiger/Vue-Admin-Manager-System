import { defineStore } from 'pinia'
import {
  accountLoginRequest,
  getUserInfoById,
  getUserMenuByRoleId
} from '@/service/login/login'

import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'
import { mapMenusToRoutes, mapMenusToPermissions } from '@/utils/map-menus'
import router from '@/router'
import { LOGIN_TOKEN, USERINFO, USERMENUS } from '@/global/constants'
// import type { RouteRecordRaw } from 'vue-router'
import useMainStore from '../main/main'
interface ILoginState {
  token: string
  // 也可以利用JSON TO TYPESCRIPT网站转换一下数据
  userInfo: any
  userMenus: any
  permissions: string[]
}

/* 箭头函数指定类型讲解
function foo(): number {
  return 123
}
const bar = (): number => {
  return 123
}
*/
const useLoginStore = defineStore('login', {
  // 如何指定state的类型
  state: (): ILoginState => ({
    token: '',
    userInfo: {},
    userMenus: [],
    permissions: []
  }),
  actions: {
    async loginAccountAction(account: IAccount) {
      // 1.账号登录，获取token等信息
      // 网络请求应该在store中进行执行，业务页面直接调用该请求完成store参数的录入即可

      const loginResult = await accountLoginRequest(account)
      const id = loginResult.data.id
      this.token = loginResult.data.token
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 3.获取登录用户的详细信息(role信息)
      const userInfoResult = await getUserInfoById(id)
      const userInfo = userInfoResult.data
      this.userInfo = userInfo
      // 4.根据角色请求用户的权限(路由映射表menus)
      // 获取路由映射表(userMenus)
      // 代码写在对应的位置
      const userMenusResult = await getUserMenuByRoleId(this.userInfo.role_id)
      const userMenus = userMenusResult.data
      this.userMenus = [...userMenus]

      // 5.进行本地缓存
      // 以LOGIN_TOKEN的键名存入token
      localCache.setCache(USERINFO, userInfo)
      localCache.setCache(USERMENUS, userMenus)
      // 6.请求所有的roles/departments数据
      const mainStore = useMainStore()
      mainStore.fetchEntireDataAction()

      // (重要)获取登录用户的所有按钮的权限
      const permissionList = mapMenusToPermissions(userMenus)
      this.permissions = [...permissionList]
      // 7.(重要)动态地通过路由映射表添加路由
      // 登录时调用mapMenusToRoutes获取符合权限的路由映射表
      const routes = mapMenusToRoutes(userMenus)
      routes.forEach((route) => {
        // 最终嵌套进去的路由还是本地定义的路由对象，用于vue-router的导航
        router.addRoute('main', route)
      })
      // 8.页面跳转(main页面),后续操作包含了已登录的情况下，跳转至指定的firstMenu路由
      router.push('/main')
    },

    // 默认在已登录的情况下，刷新页面后再次获取符合权限的路由映射表
    loadLocalCacheAction() {
      // 用户刷新默认加载数据
      const token = localCache.getCache(LOGIN_TOKEN)
      const userInfo = localCache.getCache(USERINFO)
      const userMenus = localCache.getCache(USERMENUS)
      // 只有token，个人信息，路由映射表都存在时才进行路由路由映射表的数据加载(代表验证登录成功)
      if (token && userInfo && userMenus) {
        this.token = token
        this.userInfo = userInfo
        this.userMenus = userMenus
        // 1.请求所有的roles/departments数据
        const mainStore = useMainStore()
        mainStore.fetchEntireDataAction()
        // (重要)获取登录用户的所有按钮的权限
        const permissionList = mapMenusToPermissions(userMenus)
        this.permissions = [...permissionList]
        // 2.动态添加路由
        // 在已登录的情况下为了获取路由映射表，调用mapMenusToRoutes获取符合权限的路由映射表
        const routes = mapMenusToRoutes(userMenus)
        routes.forEach((route) => {
          router.addRoute('main', route)
        })
      }
    }
  }
})
export default useLoginStore
