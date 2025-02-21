export interface trademarkType {
  trademarkFile?: any[]
  trademarkName?: string
}
export interface standardType {
  standardNum?: string
  realPhoto?: any[]
  packagingPhoto?: any[]
}
export interface testReportType {
  year?: string
  pdfUrl?: string
}
export interface formItemType {
  id?: any
  type?: string | null
  tag?: string
  address?: string
  props?: any
  sort?: number
  prop: string
  label: string
  placeholder?: string
  span?: number
  disable?: boolean
  initialValue?: any
  rows?: number
  required?: boolean
  hidden?: boolean
  rangeSeparator?: string
  parentId?: number
  permission?: string
  slotName?: string
  maxlength?: number
  action?: string
  listType?: string
  trademark?: trademarkType
  options?: any[]
  multiple?: boolean
  intro?: string
  standardList?: standardType
  testReportList?: testReportType
  inputType?: string
  maxCount?: number
  allowedTypes?: string[]
  min?: number
  customType?: string
  validator?: (rule: any, value: any, callback: Function) => void
  max?: number
  step?: number
  rules?: any
  disabled?: boolean
  labelDescription?: string
}

export interface IModalConfig {
  customFormItemName?: string
  propSlotData?: any[]
  propSlotValue?: string | number
  pageName: string
  width?: string
  labelWidth?: string
  header: {
    newTitle?: string
    editTitle?: string
  }
  formItems: formItemType[]
  otherInfo?: any
  rules?: any
}

export interface IModalProps {
  modalConfig: IModalConfig
}
