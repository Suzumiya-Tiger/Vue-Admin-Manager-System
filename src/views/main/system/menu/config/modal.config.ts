import type { IModalConfig } from '@/components/page-modal/type'

const modalConfig: IModalConfig = {
  width: '45%',
  pageName: 'menu',
  header: {
    newTitle: '新建菜单',
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
      type: 'select',
      label: '上级菜单',
      prop: 'sort',
      options: [],
      parentId: 0,
      initialValue: [],
      placeholder: '请选择上级菜单',
      required: false
    }
  ]
}
export default modalConfig
