const searchConfig = {
  labelWidth: '80px',
  formItems: [
    {
      type: 'input',
      props: 'name',
      label: '角色名称',
      placeholder: '请输入角色名称',
      span: 8,
      initialValue: ''
    },
    {
      type: 'input',
      props: 'leader',
      label: '权限介绍',
      placeholder: '请输入权限介绍',
      span: 8,
      initialValue: ''
    },
    {
      type: 'select',
      props: 'enable',
      label: '选择状态',
      placeholder: '请选择当前的状态',
      span: 8,
      initialValue: '',
      options: []
    },
    {
      type: 'date-picker',
      props: 'createAt',
      label: '创建时间',
      span: 8,
      rangeSeparator: '至',
      initialValue: []
    }
  ]
}
export default searchConfig
