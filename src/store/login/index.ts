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
import { LOGIN_TOKEN, USERINFO, USERMENUS, USER_ID } from '@/global/constants'

interface ILoginState {
  token: string
  userInfo: Record<string, any>
  userMenus: any[]
  permissions: string[]
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: '',
    userInfo: {},
    userMenus: [],
    permissions: []
  }),
  actions: {
    async loginAccountAction(account: IAccount): Promise<void> {
      try {
        // 1.账号登录，获取token等信息
        const loginResult = await accountLoginRequest(account)
        const { id, token } = loginResult.data
        this.token = token
        localCache.setCache(LOGIN_TOKEN, this.token)
        localCache.setCache(USER_ID, id)

        // 2.获取用户信息
        const userInfoResult = await getUserInfoById(id)
        this.userInfo = userInfoResult.data
        localCache.setCache(USERINFO, this.userInfo)

        // 3.根据角色获取权限菜单
        const userMenusResult = await getUserMenuByRoleId(this.userInfo.role_id)
        this.userMenus = [...userMenusResult.data]
        localCache.setCache(USERMENUS, this.userMenus)

        // 4.获取按钮权限并动态注册路由
        this.permissions = [...mapMenusToPermissions(this.userMenus)]
        const routes = mapMenusToRoutes(this.userMenus)
        routes.forEach((route) => router.addRoute('main', route))

        // 5. 跳转到主页面
        router.push('/main')
      } catch (error) {
        console.error('Login failed:', error)
        // Handle login error, e.g., show a notification
      }
    },
    async loadLocalCacheAction() {
      const token = localCache.getCache(LOGIN_TOKEN)
      const userId = localCache.getCache(USER_ID)

      if (token && userId) {
        this.token = token

        // 重新获取用户信息
        const userInfoResult = await getUserInfoById(userId)
        this.userInfo = userInfoResult.data
        localCache.setCache(USERINFO, this.userInfo)

        // 获取用户菜单
        const userMenusResult = await getUserMenuByRoleId(this.userInfo.role_id)
        this.userMenus = [...userMenusResult.data]
        localCache.setCache(USERMENUS, this.userMenus)

        // 获取按钮权限并动态注册路由
        this.permissions = [...mapMenusToPermissions(this.userMenus)]
        const routes = mapMenusToRoutes(this.userMenus)
        routes.forEach((route) => router.addRoute('main', route))
        // 5. 跳转到主页面
        router.push('/main')
      }
    }
  }
})

export default useLoginStore
