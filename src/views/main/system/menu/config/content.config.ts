const contentConfig = {
  pageName: 'menu',
  headers: {
    title: '菜单列表'
  },
  propsList: [
    { label: '菜单名称', prop: 'name', width: '180px' },
    { label: '级别', prop: 'type', width: '120px' },
    { label: '菜单url', prop: 'url', width: '150px' },
    { label: '菜单icon', prop: 'icon', width: '150px' },
    { label: '排序', prop: 'sort', width: '120px' },
    { label: '权限', prop: 'permission', width: '150px' },
    { type: 'timer', prop: 'createAt', label: '创建时间' },
    { type: 'timer', prop: 'updateAt', label: '更新时间' },
    { type: 'handler', label: '操作', width: '150px' }
  ],
  childTree: {
    rowkey: 'id',
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
export default contentConfig
