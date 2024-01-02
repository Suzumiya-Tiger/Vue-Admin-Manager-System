export interface propsListOptions {
  type?: string
  label: string
  prop?: string
  width?: string
  slotName?: string
  align?: string
}

export interface IProps {
  contentConfig: {
    pageName: string
    headers?: {
      title?: string
      btnTitle?: string
    }
    // 动态地生成tableList
    propsList: propsListOptions[]
    childTree?: {
      rowkey: string
      children: string
      hasChildren: string
      load?: Boolean
    }
  }
}
