import type { IModalConfig } from '@/components/page-modal/type'

const modalConfig: IModalConfig = {
  width: '45%',
  pageName: 'department',

  header: {
    newTitle: '新建部门',
    editTitle: '编辑部门'
  },
  formItems: [
    {
      type: 'input',
      prop: 'name',
      label: '部门名称',
      placeholder: '请输入部门名称',
      span: 8,
      initialValue: '1111',
      required: false
    },
    {
      type: 'select',
      prop: 'parentId',
      label: '上级部门',
      placeholder: '请选择上级部门',
      span: 8,
      initialValue: '',
      options: [],
      required: false
    },
    {
      type: 'input',
      prop: 'leader',
      label: '部门领导',
      placeholder: '请输入部门领导',
      span: 8,
      initialValue: '',
      required: false
    }
  ]
}
export default modalConfig
