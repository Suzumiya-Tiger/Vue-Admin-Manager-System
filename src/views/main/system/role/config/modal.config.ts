import type { IModalConfig } from '@/components/page-modal/type'

const modalConfig: IModalConfig = {
  pageName: 'role',
  header: {
    newTitle: '新建角色',
    editTitle: '编辑角色'
  },
  formItems: [
    {
      type: 'input',
      label: '角色名称',
      prop: 'name',
      placeholder: '请输入角色名称',
      required: true,
      initialValue: ''
    },
    {
      type: 'input',
      label: '权限介绍',
      prop: 'intro',
      placeholder: '请输入权限介绍',
      required: false,
      initialValue: ''
    },
    {
      type: 'custom',
      slotName: 'menuList',
      label: '菜单列表',
      prop: 'menuList',
      placeholder: '请选择菜单列表',
      required: true,
      initialValue: []
    },
    {
      type: 'keyValue',
      label: 'id',
      prop: 'id',
      hidden: true,
      initialValue: null
    }
  ]
}
export default modalConfig
