import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'

import {
  accountLoginRequest,
  getUserInfoById,
  getUserMenuByRoleId
} from '@/service/modules/login/login'

import type { IAccount } from '@/types'

import { mapMenusToRoutes, mapMenusToPermissions } from '@/utils/map-menus'
import router from '@/router'
import { LOGIN_TOKEN, USERINFO, USERMENUS } from '@/global/constants'
// import type { RouteRecordRaw } from 'vue-router'
// import useMainStore from '../main/main'
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
    /*  未登录的情况下，登录账号的操作 */
    async loginAccountAction(account: IAccount): Promise<void | undefined> {
      // 1.账号登录，获取token等信息
      const loginResult = await accountLoginRequest(account)
      const id = loginResult.data.id
      this.token = loginResult.data.token
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 2.获取用户信息
      const userInfoResult = await getUserInfoById(id)
      this.userInfo = userInfoResult.data

      // 3.根据角色获取权限菜单
      const userMenusResult = await getUserMenuByRoleId(this.userInfo.role_id)
      this.userMenus = [...userMenusResult.data]
      localCache.setCache(USERINFO, this.userInfo)
      localCache.setCache(USERMENUS, this.userMenus)

      // 4.获取按钮权限并动态注册路由
      this.permissions = [...mapMenusToPermissions(this.userMenus)]
      const routes = mapMenusToRoutes(this.userMenus)
      routes.forEach((route) => router.addRoute('main', route))

      // 5. 跳转到主页面
      router.push('/main')
    },
    /* 默认在已登录的情况下，刷新页面后再次获取符合权限的路由映射表 */
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
        // 1.(重要)获取登录用户的所有按钮的权限
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
