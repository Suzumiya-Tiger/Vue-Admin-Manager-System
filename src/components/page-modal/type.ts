interface formItemType {
  type: string
  prop: string
  label: string
  placeholder?: string
  span?: number
  initialValue?: string
  required?: boolean
  rangeSeparator?: string
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
}

export interface IModalProps {
  modalConfig: IModalConfig
}
