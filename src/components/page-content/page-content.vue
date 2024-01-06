<template>
  <div class="content">
    <div class="header">
      <h3 class="title">{{ contentConfig.headers?.title ?? '数据列表' }}</h3>
      <el-button
        v-if="isCreate && contentConfig.headers?.btnTitle"
        type="primary"
        @click="createNewUserClick"
        >{{ contentConfig.headers.btnTitle }}</el-button
      >
    </div>
    <div class="table">
      <el-table
        ref="tableRef"
        :data="pageList"
        border
        style="width: 100%"
        :row-key="contentConfig?.childTree?.rowkey"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <template v-for="item in contentConfig.propsList" :key="item.prop">
          <template v-if="item.type && item.type === 'timer'">
            <el-table-column :label="item.label">
              <template #default="scope">
                <div>
                  {{
                    formatUTC(
                      item.prop ? scope.row[item.prop] : '',
                      'YYYY-MM-DD hh:mm:ss'
                    )
                  }}
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.type === 'handler'">
            <el-table-column :label="item.label" :width="item.width">
              <template #default="scope">
                <el-button
                  v-if="isUpdate"
                  size="small"
                  text
                  icon="Edit"
                  class="editBtn btn"
                  @click="handleEditClick(scope.row)"
                  type="primary"
                  >编辑
                </el-button>
                <el-popconfirm
                  width="220"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  icon="InfoFilled"
                  icon-color="#626AEF"
                  title="您确认要删除本条数据吗？"
                  @confirm="handleDeleteClick(scope.row.id)"
                >
                  <template #reference>
                    <el-button
                      v-if="isDelete"
                      size="small"
                      text
                      icon="Delete"
                      class="btn"
                      type="danger"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </template>
          <!-- 高阶组件：通过插槽来更为灵活地实现特殊需求，
                将具体的操作移交给组件调用的模板语法之中去自定义实现 -->
          <template v-else-if="item.type === 'custom'">
            <el-table-column
              :label="item.label"
              :width="item.width"
              :align="item.align"
            >
              <template #default="scope">
                <slot :name="item.slotName" v-bind="scope"></slot>
              </template>
            </el-table-column>
          </template>
          <!-- v-bind="item"相当于v-bind="{name:item.name,width:item.width...}" -->
          <!-- 这是解构语法的体现 -->
          <template v-else> <el-table-column v-bind="item" /></template>
        </template>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total,prev, pager,next,sizes,jumper"
        :total="pageTotalCount"
        @update:current-page="handleCurrentChange"
        @update:size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, nextTick, ref, onBeforeMount } from 'vue'
import useSystemStore from '@/store/main/system'
import type { ISystemState } from '@/store/main/system/type'
import useMainStore from '@/store/main/main'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/date-format'
import { ElMessage, ElTable } from 'element-plus'
import type { IProps } from './type'
import usePermissions from '@/hooks/usePermissions'
import { withLoading } from '@/hooks/withLoading'

const props = defineProps<IProps>()
// 定义事件
const emit = defineEmits<{
  newBtnClick: []
  editBtnClick: [rowData: any]
}>()
const tableRef = ref<InstanceType<typeof ElTable>>()

// 0.获取是否存在对应的增删改查的权限

const isCreate = usePermissions(`${props.contentConfig.pageName}:create`)

const isDelete = usePermissions(`${props.contentConfig.pageName}:delete`)

const isUpdate = usePermissions(`${props.contentConfig.pageName}:update`)

const isQuery = usePermissions(`${props.contentConfig.pageName}:query`)

// 分页器
const small = shallowRef(false)
const background = shallowRef(false)
const disabled = shallowRef(false)
const currentPage = shallowRef(1)
const pageSize = shallowRef(10)
const handleSizeChange = (val: number) => {
  console.log(val)

  pageSize.value = val
  fetchPageListData()
}
const handleCurrentChange = (val: number) => {
  console.log(val)
  currentPage.value = val
  fetchPageListData()
}

// 1.使用Pinia进行网络请求的统一管理，不要直接调用网络请求，以此达到业务页面各功能模块的解耦
// 先获取pinia的systemStore对象
const systemStore = useSystemStore()
// 监听systemStore中的actions被执行
systemStore.$onAction(({ name, after }) => {
  // after是一个执行完成后的函数，会在成功完成对应的action操作后方才执行
  after(() => {
    if (
      name === 'newPageDataAction' ||
      name === 'deletePageByIdAction' ||
      name === 'editPageDataAction'
    ) {
      currentPage.value = 1
      pageSize.value = 10
    }
  })
})
/* 在 Vue 和 Pinia 中，storeToRefs 创建的 ref 是响应式的，
这意味着当 systemStore 中的状态改变时，这些 ref 也会自动更新。
因此，即使 fetchPageListData 是异步的，
pageList 和 pageTotalCount 也会在数据准备好后自动更新。 */
onBeforeMount(() => {
  fetchPageListData()
})
// 2.通过在pinia的systemStore对象中完成数据请求，再获取usersList的数据,进行展示
// 注意这里是分开执行的是异步操作，所以usersList的数据如果通过同步的方式获取最后得到是空的
/* 在 Pinia 中，storeToRefs 是一个辅助函数，
用于将 Pinia 存储（store）中的状态转换为响应式的引用（ref）。
它的作用是简化将存储状态绑定到组件模板中的过程。
当你在使用 Pinia 来管理应用程序的状态时，存储中的状态通常是响应式的 */
const { pageList, pageTotalCount } = storeToRefs(systemStore)

// 3.定义函数用于发送网络请求
// formData可能是空的，这里要进行默认数据判断处理
async function fetchPageListData(formData: any = {}) {
  if (!isQuery) {
    return
  }
  // 1.获取offset/size
  const size = pageSize.value
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }
  // 2.发送网络请求

  const queryInfo = { ...pageInfo, ...formData }

  await withLoading(
    () =>
      systemStore.postPageListAction(props.contentConfig.pageName, queryInfo),
    {
      lock: true,
      text: '正在加载中...',
      background: 'rgba(122, 122, 122, 0.8)',
      target: tableRef.value?.$el
    }
  )()
}
// 4.删除用户
async function handleDeleteClick(id: number) {
  console.log(id)
  /*
  当你使用 await systemstore.deletepagebyidaction() 时，
  await 关键字会等待 Promise 对象(deleteUserById(id))的解析，并将解析后的值作为结果返回。
  在这种情况下，await 会等待 JSON 数据的解析完成，然后将解析后的数据作为结果返回给变量 delRes。
  如果不使用 await，而是直接访问 systemstore.deletepagebyidaction() 的返回值，
  你将得到一个未解析的 Promise 对象，而不是实际的数据。
  因为 systemstore.deletepagebyidaction() 是一个异步操作，
  返回的 Promise 对象可能在数据解析完成之前被访问，这样就无法获取到完整的数据。
  因此，为了确保在访问数据之前已经完成解析，需要使用 await 关键字来等待 Promise 对象的解析完成。
  这样，你可以确保 delRes 变量中保存的是解析后的数据，而不是 Promise 对象。
  */
  const delRes = await systemStore.deletePageByIdAction(
    props.contentConfig.pageName,
    id
  )
  if (Number(delRes.code)) {
    ElMessage({
      message: delRes.message,
      type: 'error'
    })
    return
  }
  const useStore = useSystemStore()
  useStore.changeFirstLoad()
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  fetchPageListData()
}

async function isGetEntireData() {
  const mainStore: ISystemState = useSystemStore()
  if (mainStore.isFirstLoad) {
    // 获取完整的全局应用数据
    const mainStore = useMainStore()

    await withLoading(() =>
      mainStore.fetchEntireDataAction(props.contentConfig.pageName)
    )()
  }
}
// 5.创建用户的操作
async function createNewUserClick() {
  await isGetEntireData()
  emit('newBtnClick')
}
// 6.编辑用户的操作
async function handleEditClick(rowData: any) {
  await isGetEntireData()
  nextTick(() => {
    emit('editBtnClick', rowData)
  })
}

// 将该函数暴露出去，供其他组件使用
defineExpose({ fetchPageListData })
</script>

<style lang="less" scoped>
.content {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff;

  .header {
    display: flex;
    height: 45px;
    padding: 0 5px;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .handler {
      align-items: center;
    }
  }

  .table {
    :deep(.el-table__cell) {
      padding: 14px 0;
    }
    .btn {
      padding: 0;
      position: relative;
    }
    .editBtn::after {
      content: '';
      position: absolute;
      width: 0.6px;
      height: 12px;
      background-color: #ccc;
      right: -18%;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
