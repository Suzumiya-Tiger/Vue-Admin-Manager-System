import type { RouteRecordRaw } from 'vue-router'
// 加载本地路由的函数
function loadLocalRoutes() {
  // 根据路由映射表动态的添加路由对象(路由对象放在独立的文件之中)
  // 6.1.动态的添加所有的路由对象，放在数组中
  // *路由对象都在独立的文件之中
  // *在文件中将所有的路由对象先读取到数组中
  const localRoutes: RouteRecordRaw[] = []
  // 6.2.利用import.meta.glob()读取router/main当中所有的ts文件
  // eager代表取消import.meta的回调函数，而是直接取得回调的结果
  // 添加: Record<string, any>是为了避免routerFiles的类型为unknown
  const routerFiles: Record<string, any> = import.meta.glob(
    '../router/main/**/*.ts',
    {
      eager: true
    }
  )
  // 6.3.将加载的对象放到localRoutes里面
  for (const key in routerFiles) {
    const module = routerFiles[key]
    //  module.default => 路由对象
    // 将路由对象添加到localRoutes里面
    localRoutes.push(module.default)
  }
  return localRoutes
}
// 初次加载时单独定义该全局变量(首次加载的路由)
export let firstMenu: any = null

export function mapMenusToRoutes(userMenus: any[]) {
  // 1.先加载本地的路由
  const localRoutes = loadLocalRoutes()
  // 2.根据路由映射表去匹配正确的路由
  // 先把前端本地路由映射表的路由全部汇总进来，然后再和从后端获取的路由映射表进行匹配
  const routes: RouteRecordRaw[] = []
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      const route = localRoutes.find((route) => route.path === submenu.url)
      // 有可能不存在，所以需要判断
      if (route) routes.push(route)
      // 记录第一个被匹配到的路由映射对象，即从后端获取的路由映射表列表中选取第一个路由映射表
      if (!firstMenu && route) firstMenu = submenu
    }
  }
  return routes
}

/**
 * 根据路径去匹配需要显示的菜单,适用于根据当前页面的路由地址，匹配到对应的菜单
 * @param path 需要匹配的路径
 * @param userMenus 后端返回的所有的菜单
 */
export function mapPathToMenu(path: string, userMenus: any[]) {
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      // 寻找等于传入path的路由映射
      if (submenu.url === path) {
        return submenu
      }
    }
  }
}
