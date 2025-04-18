import { localCache } from '@/utils/cache'
import { LOGIN_TOKEN, USERMENUS, USERINFO } from '@/global/constants'
import {
  getUserInfoById,
  getUserMenuByRoleId
} from '@/service/modules/login/login'
import { mapMenusToRoutes, mapMenusToPermissions } from '@/utils/map-menus'
import router from '@/router'
import { nextTick } from 'vue'
import useLoginStore from '@/store/login'

/**
 * 处理 URL 中的 token 参数
 * @returns Promise<boolean> 是否成功处理 token
 */
export async function processUrlToken(): Promise<boolean> {
  let tokenParam = null

  // 1. 首先尝试从常规 search 参数获取 token（通常不适用于 hash 路由）
  const urlParams = new URLSearchParams(window.location.search)
  tokenParam = urlParams.get('token')

  // 2. 如果没找到，尝试从 hash 路由中提取
  if (!tokenParam) {
    // 获取 hash 部分 (例如: "#/sales/list?token=xxx")
    const hashPart = window.location.hash

    // 寻找 hash 路径中的查询参数起始位置
    const queryIndex = hashPart.indexOf('?')

    if (queryIndex !== -1) {
      // 提取查询参数部分 (例如: "token=xxx")
      const queryPart = hashPart.substring(queryIndex + 1)

      // 解析查询参数
      const hashParams = new URLSearchParams(queryPart)
      tokenParam = hashParams.get('token')
    }
  }

  // 如果没有 token 参数，直接返回 false
  if (!tokenParam) return false

  try {
    // 提取实际 token 值
    const actualToken = tokenParam.startsWith('Authorization=')
      ? tokenParam.substring('Authorization='.length)
      : tokenParam

    // 检查是否与当前 token 相同
    const currentToken = localCache.getCache(LOGIN_TOKEN)

    // 获取 loginStore 实例
    const loginStore = useLoginStore()

    // 检查是否需要刷新用户数据
    const needRefresh = actualToken !== currentToken

    if (!needRefresh) {
      console.log('当前 token 与 URL token 相同，不需要刷新用户数据')
      return false
    }

    // 保存新 token 到缓存和 store
    localCache.setCache(LOGIN_TOKEN, actualToken)
    loginStore.token = actualToken

    // 清除旧的用户数据
    loginStore.userInfo = {}
    loginStore.userMenus = []
    loginStore.permissions = []

    // 获取用户信息
    const userInfoResult = await getUserInfoById()
    if (!userInfoResult || !userInfoResult.data) {
      throw new Error('获取用户信息失败')
    }

    // 保存用户信息
    const userInfo = userInfoResult.data
    loginStore.userInfo = userInfo
    localCache.setCache(USERINFO, userInfo)

    // 获取用户菜单
    const userMenusResult = await getUserMenuByRoleId(userInfo.roleId)
    if (!userMenusResult || !userMenusResult.data) {
      throw new Error('获取用户菜单失败')
    }

    // 保存用户菜单
    const userMenus = [...userMenusResult.data.menu]
    loginStore.userMenus = userMenus
    localCache.setCache(USERMENUS, userMenus)

    // 生成权限
    const permissions = [...mapMenusToPermissions(userMenus)]
    loginStore.permissions = permissions

    // 清除现有动态路由
    router.getRoutes().forEach((route) => {
      if (
        route.name &&
        route.name !== 'main' &&
        route.name !== 'login' &&
        route.name !== 'not-found' &&
        route.name !== 'overview'
      ) {
        router.removeRoute(route.name)
      }
    })

    // 添加新的动态路由
    const routes = mapMenusToRoutes(userMenus)
    routes.forEach((route) => router.addRoute('main', route))

    // 简化：检测到 token 变更，直接导航到 /main
    console.log('检测到 token 变更，直接导航到主页')

    // 使用 nextTick 确保 DOM 更新和路由注册完成后再导航
    await nextTick(async () => {
      try {
        // 直接导航到主页
        await router.push('/main')
      } catch (navError) {
        console.error('导航失败:', navError)
      }
    })

    return true
  } catch (error) {
    console.error('处理 URL token 出错:', error)

    // 清空登录状态
    clearLoginState()

    return false
  }
}

/**
 * 检查路径是否存在于用户菜单中
 * @param path 要检查的路径
 * @param userMenus 用户菜单
 * @returns 路径是否存在于菜单中
 */
function checkPathExistsInMenus(path: string, userMenus: any[]): boolean {
  // 处理 /main 路径 - 始终允许访问
  if (path === '/main') return true

  // 移除查询参数部分，只保留路径
  const cleanPath = path.split('?')[0]

  // 递归检查菜单中是否包含路径
  const checkMenu = (menus: any[]): boolean => {
    for (const menu of menus) {
      // 检查当前菜单项
      if (menu.url === cleanPath) {
        return true
      }

      // 检查子菜单
      if (menu.children && menu.children.length) {
        if (checkMenu(menu.children)) {
          return true
        }
      }
    }
    return false
  }

  return checkMenu(userMenus)
}

/**
 * 清除所有登录相关状态
 */
export function clearLoginState() {
  // 清除缓存
  localCache.removeCache(LOGIN_TOKEN)
  localCache.removeCache(USERMENUS)
  localCache.removeCache(USERINFO)

  // 跳转到登录页
  router.push('/login')
}
