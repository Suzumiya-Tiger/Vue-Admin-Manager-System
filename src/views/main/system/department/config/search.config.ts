const searchConfig = {
  formItems: [
    {
      type: 'input',
      props: 'name',
      label: '部门名称',
      placeholder: '请输入部门名称',
      span: 8,
      initialValue: ''
    },
    {
      type: 'input',
      props: 'leader',
      label: '部门领导',
      placeholder: '请输入部门领导',
      span: 8,
      initialValue: ''
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
