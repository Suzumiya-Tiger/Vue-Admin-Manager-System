import {
  getEntireDepartment,
  getEntireMenus,
  getEntireRoles
} from '@/service/modules/main/main'
import { defineStore } from 'pinia'
interface IMainState {
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}
const fetchDataMap: Record<string, () => Promise<any>> = {
  role: async () => {
    const departmentsResult = await getEntireDepartment()
    const menuResult = await getEntireMenus()
    return { departmentsResult, menuResult }
  },
  department: async () => {
    const rolesResult = await getEntireRoles()
    const menuResult = await getEntireMenus()
    return { rolesResult, menuResult }
  },
  menus: async () => {
    const rolesResult = await getEntireRoles()
    const departmentsResult = await getEntireDepartment()
    return { rolesResult, departmentsResult }
  }
}
import useSystemStore from '../main/system/system'
const useMainStore = defineStore('main', {
  state: (): IMainState => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    async fetchEntireDataAction(pageName: string) {
      const fetchData = fetchDataMap[pageName]
      if (fetchData) {
        const { rolesResult, departmentsResult, menuResult } = await fetchData()
        // 保存数据
        this.entireRoles = rolesResult?.data.list || []
        this.entireDepartments = departmentsResult?.data.list || []
        this.entireMenus = menuResult?.data.list || []
      }
      const useStore = useSystemStore()
      useStore.changeFirstLoad()
    }
  }
})
export default useMainStore
