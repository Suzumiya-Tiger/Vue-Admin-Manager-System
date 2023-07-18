const contentConfig = {
  header: {
    title: '部门列表',
    btnTitle: '新建部门'
  },
  propsList: [
    { type: 'selection', label: '选择', width: '60px' },
    { type: 'index', label: '序号', width: '150px' },
    { type: 'normal', label: '部门名称', prop: 'name', width: '150px' },
    { type: 'normal', label: '部门领导', prop: 'leader', width: '150px' },
    { type: 'normal', label: '上级部门', prop: 'parentId', width: '150px' },
    // 区分自定义插槽部分
    { type: 'timer', label: '创建时间', prop: 'createTime' },
    { type: 'timer', label: '更新时间', prop: 'updateTime' },

    { type: 'handler', label: '操作', width: '160px' }
  ]
}

export default contentConfig
