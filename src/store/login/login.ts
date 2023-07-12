import { defineStore } from 'pinia'
import {
  accountLoginRequest,
  getUserInfoById,
  getUserMenuByRoleId
} from '@/service/login/login'

import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'

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
      // 根据菜单动态的添加路由对象(路由对象放在独立的文件之中)
      // 1.动态的添加所有的路由对象，放在数组中
      // *路由对象都在独立的文件之中
      // *在文件中将所有的路由对象先读取到数组中
      const localRoutes: RouteRecordRaw[] = []
      // 1.1.利用import.meta.glob()读取router/main当中所有的ts文件
      // eager代表取消import.meta的回调函数，而是直接取得回调的结果
      // 添加: Record<string, any>是为了避免routerFiles的类型为unknown
      const routerFiles: Record<string, any> = import.meta.glob(
        '../../router/main/**/*.ts',
        {
          eager: true
        }
      )
      for (const key in routerFiles) {
        const module = routerFiles[key]
        //  module.default => 路由对象
        // 将路由对象添加到localRoutes里面
        localRoutes.push(module.default)
      }
      console.log(routerFiles)
      // 2.根据菜单去匹配正确的路由
      // *router.addRoute('main',xx)

      // 7.页面跳转(main页面)
      router.push('/main')
    }
  }
})
export default useLoginStore
