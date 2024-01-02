const contentConfig = {
  pageName: 'users',
  headers: {
    title: '用户列表',
    btnTitle: '新建用户'
  },
  propsList: [
    { type: 'selection', label: '选择', width: '60px' },
    { type: 'index', label: '序号', width: '80px' },
    { type: 'normal', label: '用户名', prop: 'name', width: '150px' },
    { type: 'normal', label: '真实姓名', prop: 'realname', width: '150px' },
    { type: 'normal', label: '手机号码', prop: 'cellphone', width: '150px' },
    {
      type: 'custom',
      label: '状态',
      prop: 'enable',
      align: 'center',
      slotName: 'status',
      width: '120px'
    },
    { type: 'timer', label: '创建时间', prop: 'createAt' },
    { type: 'timer', label: '更新时间', prop: 'updateAt' },
    { type: 'handler', label: '操作', width: '160px' }
  ]
}

export default contentConfig
