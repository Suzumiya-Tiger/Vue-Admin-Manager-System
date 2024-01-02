export interface IUser {
  id: number
  name: string
  realname: string
  cellphone: number
  enable: number
  departmentId: number
  role_id: number
  createAt: string
  updateAt: string
}
export interface ISystemState {
  isFirstLoad: boolean
  pageList: any[]
  pageTotalCount: number
}
