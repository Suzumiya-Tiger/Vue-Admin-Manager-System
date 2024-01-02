import type { departmentType } from './department'
export interface roleType {
  id: number
  name: string
  intro: string
  createAt: string
  updateAt: string
  menuList: departmentType[]
}
