<template>
  <div class="content">
    <div class="header">
      <el-button
        v-if="isCreate && contentConfig.headers?.btnTitle"
        type="primary"
        @click="createNewUserClick"
      >
        {{ contentConfig.headers.btnTitle }}
      </el-button>
      <slot name="header-buttons"></slot>
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
          <template v-if="item.type === 'timer'">
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
          <template v-else-if="item.type === 'index'">
            <el-table-column :label="item.label" type="index" width="80">
              <template #default="scope">
                {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.type === 'handler'">
            <el-table-column :label="item.label" :width="item.width">
              <template #default="scope">
                <el-button
                  v-if="isUpdate && !hiddenCheck"
                  size="small"
                  text
                  icon="Edit"
                  class="editBtn btn"
                  @click="handleEditClick(scope.row)"
                  type="primary"
                >
                  编辑
                </el-button>
                <slot name="custom-handler" v-bind="scope" />
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
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </template>
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
          <template v-else>
            <el-table-column v-bind="item" />
          </template>
        </template>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="contentConfig.pageSizes ?? [10, 20, 30, 40]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total,prev, pager,next,sizes,jumper"
        :total="pageTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, nextTick, ref, onBeforeMount, computed } from 'vue'
import useSystemStore from '@/store/main/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/date-format'
import { ElMessage, ElTable } from 'element-plus'
import usePermissions from '@/hooks/usePermissions'
import { withLoading } from '@/hooks/withLoading'
import useMainStore from '@/store/main/main'
import type { ISystemState } from '@/store/main/system/type'

const props = defineProps<{
  contentConfig: Record<string, any>
  hiddenCheck?: boolean
}>()

const emit = defineEmits<{
  newBtnClick: []
  checkBtnClick: [rowData: any]
}>()

const hiddenCheck = props.hiddenCheck ?? false

const tableRef = ref<InstanceType<typeof ElTable>>()

const isCreate = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:create`
)

const isDelete = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:delete`
)

const isUpdate = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:update`
)

const isCheck = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:get`
)
console.log('isCheck', isCheck)

const isQuery = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:query`
)

const small = shallowRef(false)
const background = shallowRef(false)
const disabled = shallowRef(false)
const currentPage = shallowRef(1)
const pageSize = shallowRef(props.contentConfig.pageSizes?.[0] ?? 10)

const systemStore = useSystemStore()
const { pageList, pageTotalCount } = storeToRefs(systemStore)

onBeforeMount(() => {
  fetchPageListData()
})
async function isGetEntireData() {
  const mainStore: ISystemState = useSystemStore()
  console.log(mainStore.isFirstLoad)

  if (mainStore.isFirstLoad) {
    // 获取完整的全局应用数据
    const mainStore = useMainStore()
    await withLoading(() =>
      mainStore.fetchEntireDataAction(props.contentConfig.middleName)
    )()
  }
}
async function fetchPageListData(formData: any = {}) {
  if (!isQuery) return

  const size = pageSize.value
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }
  const queryInfo = { ...pageInfo, ...formData }

  await withLoading(
    () =>
      systemStore.postPageListAction(props.contentConfig.middleName, queryInfo),
    {
      lock: true,
      text: '正在加载中...',
      background: 'rgba(122, 122, 122, 0.8)',
      target: tableRef.value?.$el
    }
  )()
}

async function handleDeleteClick(id: number) {
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
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  fetchPageListData()
}

async function createNewUserClick() {
  await isGetEntireData()
  emit('newBtnClick')
}

async function handleEditClick(rowData: any) {
  await isGetEntireData()
  nextTick(() => {
    emit('checkBtnClick', rowData)
  })
}

function handleSizeChange(val: number) {
  pageSize.value = val
  fetchPageListData()
}

function handleCurrentChange(val: number) {
  currentPage.value = val
  fetchPageListData()
}

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
    align-items: center;
    gap: 10px;

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
