export interface menuType {
  label?: string
  value?: number
  id: number
  icon?: string
  disabled?: boolean
  url?: string
  name?: string
  sort?: number
  type: number
  children?: menuType[]
  createAt: string
  parentId?: number
  updateAt: string
}
