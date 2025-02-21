import {
  getEntireDepartment,
  getEntireMenus,
  getEntireRoles
} from '@/service/modules/main/main'
import { defineStore } from 'pinia'
import useSystemStore from '@/store/main/system'
interface IMainState {
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}
const fetchDataMap: Record<string, () => Promise<any>> = {
  users: async () => {
    const rolesResult = await getEntireRoles()
    const departmentsResult = await getEntireDepartment()
    return { rolesResult, departmentsResult }
  },
  role: async () => {
    const menuResult = await getEntireMenus()
    return { menuResult }
  },
  menus: async () => {
    const rolesResult = await getEntireRoles()
    const departmentsResult = await getEntireDepartment()
    return { rolesResult, departmentsResult }
  }
}
const useMainStore = defineStore('main', {
  state: (): IMainState => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    async fetchEntireDataAction(pageName: string) {
      const fetchData = fetchDataMap[pageName]
      console.log('fetchData', fetchData)

      if (fetchData) {
        const { rolesResult, departmentsResult, menuResult } = await fetchData()
        // 保存数据
        this.entireRoles = rolesResult?.data.list || []
        this.entireDepartments = departmentsResult?.data.list || []
        this.entireMenus = menuResult?.data.list || []
      }
    }
  }
})
export default useMainStore
