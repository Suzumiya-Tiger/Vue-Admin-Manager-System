import {
  getEntireDepartment,
  getEntireMenus,
  getEntireRoles
} from '@/service/main/main'
import { defineStore } from 'pinia'
interface IMainState {
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}
const useMainStore = defineStore('main', {
  state: (): IMainState => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    async fetchEntireDataAction() {
      const rolesResult = await getEntireRoles()
      const departmentsResult = await getEntireDepartment()
      const menuResult = await getEntireMenus()
      // 保存数据
      this.entireRoles = rolesResult.data.list
      this.entireDepartments = departmentsResult.data.list
      this.entireMenus = menuResult.data.list
    }
  }
})
export default useMainStore
