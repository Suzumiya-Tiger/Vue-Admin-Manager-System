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

// 添加数字格式化配置接口
export interface NumberFormatConfig {
  integerLimit?: number
  decimalLimit?: number
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
  // 新增属性
  labelWidth?: string // 表单项标签宽度
  btnLabel?: string // 按钮标签文本
  numberFormat?: NumberFormatConfig // 数字格式化配置
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
