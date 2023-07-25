export interface formItemType {
  id?: number
  type: string
  prop: string
  label: string
  placeholder?: string
  span?: number
  // initialValue必须存在，为了解决表单重置时，表单项的值不会重置的问题
  initialValue?: any
  required?: boolean
  hidden?: boolean
  rangeSeparator?: string
  parentId?: number
  permission?: string
  slotName?: string
  options?: any[]
}

export interface IModalConfig {
  pageName: string
  width?: string
  header: {
    newTitle: string
    editTitle: string
  }
  formItems: formItemType[]
  otherInfo?: any
}

export interface IModalProps {
  modalConfig: IModalConfig
}
