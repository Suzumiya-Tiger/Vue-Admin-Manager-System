const searchConfig = {
  pageName: 'users',

  labelWidth: '80px',
  formItems: [
    {
      type: 'input',
      prop: 'name',
      label: '用户名',
      placeholder: '请输入用户名',
      span: 8,
      initialValue: ''
    },
    {
      type: 'input',
      prop: 'realname',
      label: '真实姓名',
      placeholder: '请输入真实姓名',
      span: 8,
      initialValue: ''
    },
    {
      type: 'input',
      prop: 'realname',
      label: '真实姓名',
      placeholder: '请输入真实姓名',
      span: 8,
      initialValue: ''
    },
    {
      type: 'select',
      prop: 'enable',
      label: '状态',
      placeholder: '请选择查询状态',
      span: 8,
      initialValue: null,
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 2
        }
      ]
    },
    {
      type: 'date-picker',
      prop: 'createAt',
      label: '创建时间',
      span: 8,
      rangeSeparator: '至',
      initialValue: []
    }
  ]
}
export default searchConfig
