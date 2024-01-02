import type { IModalConfig } from '@/components/page-modal/type'

const modalConfig: IModalConfig = {
  customFormItemName: 'parentId',
  propSlotValue: 0,
  width: '45%',
  pageName: 'menu',
  header: {
    editTitle: '编辑菜单'
  },
  formItems: [
    {
      type: 'input',
      label: '菜单名称',
      prop: 'name',
      initialValue: '',
      placeholder: '请输入菜单名称',
      required: true
    },
    {
      type: 'custom',
      slotName: 'parentMenu',
      label: '上级菜单',
      prop: 'sort',
      options: [],
      parentId: 0,
      initialValue: [],
      placeholder: '请选择上级菜单',
      required: false,
      disable: false
    }
  ]
}
export default modalConfig
