import { defineStore } from 'pinia'
import {
  accountLoginRequest,
  getUserInfoById,
  getUserMenuByRoleId
} from '@/service/login/login'

import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'
import { mapMenusToRoutes } from '@/utils/map-menus'
import router from '@/router'
import { LOGIN_TOKEN } from '@/global/constants'
import type { RouteRecordRaw } from 'vue-router'

interface ILoginState {
  token: string
  // 也可以利用JSON TO TYPESCRIPT网站转换一下数据
  userInfo: any
  userMenus: any
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
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    userInfo: localCache.getCache('userInfo') ?? {},
    userMenus: localCache.getCache('userMenus') ?? []
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
      // 4.根据角色请求用户的权限(菜单menus)
      // 获取菜单(userMenus)
      // 代码写在对应的位置
      const userMenusResult = await getUserMenuByRoleId(this.userInfo.role.id)
      const userMenus = userMenusResult.data
      this.userMenus = [...userMenus]

      // 5.进行本地缓存
      // 以LOGIN_TOKEN的键名存入token
      localCache.setCache('userInfo', userInfo)
      localCache.setCache('userMenus', userMenus)
      // 6.(重要)动态地通过菜单添加路由
      const routes = mapMenusToRoutes(userMenus)
      routes.forEach((route) => {
        // 最终嵌套进去的路由还是本地定义的路由对象，用于vue-router的导航
        router.addRoute('main', route)
      })
      // 7.页面跳转(main页面)
      router.push('/main')
    }
  }
})
export default useLoginStore
