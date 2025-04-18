import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import {
  accountLoginRequest,
  getUserMenuByRoleId,
  getUserInfoById
} from '@/service/modules/login/login'

import type { IAccount } from '@/types'
import { ElMessage } from 'element-plus'

import { mapMenusToRoutes, mapMenusToPermissions } from '@/utils/map-menus'
import router from '@/router'
import {
  LOGIN_TOKEN,
  USERMENUS,
  USERINFO,
  USER_ID,
  USER_ROLE_ID
} from '@/global/constants'
import { processUrlToken, clearLoginState } from '@/utils/processUrlToken'
// import type { RouteRecordRaw } from 'vue-router'
// import useMainStore from '../main/main'

// 添加一个常量用于存储活动模块
const ACTIVE_MODULE = 'ACTIVE_MODULE'

interface ILoginState {
  token: string
  userInfo: any

  // 也可以利用JSON TO TYPESCRIPT网站转换一下数据
  userMenus: any
  permissions: string[]
  // 添加活动模块状态
  activeModule: string
}

const useLoginStore = defineStore('login', {
  // 如何指定state的类型
  state: (): ILoginState => ({
    token: '',
    userInfo: {},
    userMenus: [],
    permissions: [],
    // 默认活动模块为登录
    activeModule: localCache.getCache(ACTIVE_MODULE) || 'login'
  }),
  actions: {
    // 添加设置活动模块的方法
    setActiveModule(moduleId: string) {
      this.activeModule = moduleId
      localCache.setCache(ACTIVE_MODULE, moduleId)
    },
    /*  未登录的情况下，登录账号的操作 */
    async loginAccountAction(accountInfo: IAccount): Promise<void | undefined> {
      // 1. 尝试处理 URL token (非常重要：在 main.ts 中已经调用过，这里是为了保险)
      /*       const urlTokenProcessed = await processUrlToken()
      if (urlTokenProcessed) {
        // URL token 已成功处理，不需要继续登录流程
        return
      } */

      // 2. 检查是否已有 token
      if (this.token) {
        localCache.setCache(LOGIN_TOKEN, this.token)
      } else {
        // 3. 执行正常登录流程 (删除了重复的 URL token 处理逻辑)
        console.log('执行正常登录流程')
        const loginResult = await accountLoginRequest(accountInfo)
        const { data } = loginResult
        const { id, token } = data
        if (loginResult.status === 200) {
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(loginResult.message)
          return
        }
        this.token = token
        localCache.setCache(LOGIN_TOKEN, this.token)
        localCache.setCache(USER_ID, id)
      }

      // 4. 获取用户信息和菜单 (其余代码保持不变)
      // 2.获取用户信息
      const userId = localCache.getCache(USER_ID)
      const userInfoResult = await getUserInfoById(userId)
      const { data } = userInfoResult
      const roleId = data.role_id
      localCache.setCache(USER_ROLE_ID, roleId)
      this.userInfo = userInfoResult.data
      localCache.setCache(USERINFO, this.userInfo)

      // 3.根据角色获取权限菜单
      const userMenusResult = await getUserMenuByRoleId(roleId)

      const { data: menuData } = userMenusResult
      this.userMenus = [...menuData]
      localCache.setCache(USERMENUS, this.userMenus)

      // 4.获取按钮权限并动态注册路由
      this.permissions = [...mapMenusToPermissions(this.userMenus)]
      const routes = mapMenusToRoutes(this.userMenus)
      routes.forEach((route) => router.addRoute('main', route))

      // 5. 跳转到主页面
      await nextTick(() => {
        // 跳转到主页面
        router.push('/main')
      })
    },
    /*     async registerAccountAction(accountInfo: IAccount) {
      try {
        // 发送注册请求，假设有一个注册 API
        const response = await accountRegisterRequest(accountInfo) // 等待请求结果
        if (response.code === 200) {
          ElMessage.success(response?.message || '注册成功')
        } else {
          ElMessage.error(response?.message || '注册失败')

          throw new Error(response?.message || '注册失败')
        }
        return response // 返回响应
      } catch (error) {
        console.error('注册请求失败:', error)
        throw error // 抛出错误，以便外层捕获
      }
    },
 */
    /* 默认在已登录的情况下，刷新页面后再次获取符合权限的路由映射表 */
    async loadLocalCacheAction(paramToken?: string) {
      const userId = localCache.getCache(USER_ID)
      const roleId = localCache.getCache(USER_ROLE_ID)
      // 加载活动模块状态
      const activeModule = localCache.getCache(ACTIVE_MODULE)
      if (activeModule) {
        this.activeModule = activeModule
      }

      // 优先使用 store 中已设置的 token，如果没有则从缓存获取
      // 这样可以正确处理从 URL 中获取并直接设置到 store 的 token
      let token = ''
      if (!paramToken) {
        token = localCache.getCache(LOGIN_TOKEN)
      } else {
        // 如果使用的是 store 中的 token (而非缓存中的)
        // 确保它被保存到缓存中以便后续使用
        token = paramToken
        localCache.setCache(LOGIN_TOKEN, paramToken)
      }

      // 只有token存在时才进行路由映射表的数据加载(代表验证登录成功)
      if (token) {
        this.token = token

        // 2.获取用户信息
        const userInfoResult = await getUserInfoById(userId)
        // 添加空值检查，处理 undefined 情况
        if (!userInfoResult) {
          this.clearAllState() // 清空状态
          return // 中断流程
        }
        // 检查用户信息请求状态，如果是500则清空缓存并重定向到登录页
        if (userInfoResult.status === 500 || userInfoResult.code === 500) {
          // 清空用户信息缓存
          this.clearAllState() // 使用现有方法清空所有状态
          return // 中断后续操作
        }

        this.userInfo = userInfoResult.data
        localCache.setCache(USERINFO, this.userInfo)

        // 3.根据角色获取权限菜单
        const userMenusResult = await getUserMenuByRoleId(roleId)

        const { data } = userMenusResult
        this.userMenus = [...data]

        localCache.setCache(USERMENUS, this.userMenus)

        // 4.获取按钮权限并动态注册路由
        this.permissions = [...mapMenusToPermissions(this.userMenus)]
        const routes = mapMenusToRoutes(this.userMenus)
        routes.forEach((route) => router.addRoute('main', route))
        // 5. 跳转到主页面
        /*       await nextTick(() => {
          // 跳转到主页面
          router.push('/main')
        }) */
      }
    },
    // 新增 action：清空所有 state
    clearAllState() {
      // 清空 state
      this.token = ''
      this.userInfo = {}
      this.userMenus = []
      this.permissions = []

      // 使用共享的清理函数
      clearLoginState()
    }
  }
})
export default useLoginStore
