<template>
  <div class="content">
    <div class="header">
      <h3 class="title">用户列表</h3>
      <el-button v-if="isCreate" type="primary" @click="createNewUserClick"
        >新建用户</el-button
      >
    </div>
    <div class="table">
      <el-table v-if="isQuery" :data="usersList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" label="序号" align="center" />

        <el-table-column prop="name" label="用户名" width="120px" />
        <el-table-column prop="realname" label="真实姓名" width="120px" />
        <el-table-column prop="cellphone" label="手机号码" width="120px" />
        <el-table-column align="center" label="状态" width="90px">
          <template #default="scope">
            <el-button
              size="small"
              plain
              :type="scope.row.enable === 1 ? 'success' : 'danger'"
            >
              {{ tranferEnable(scope.row.enable) }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              {{ formatUTC(scope.row.createAt, 'YYYY-MM-DD hh:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateAt" label="更新时间">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              {{ formatUTC(scope.row.updateAt, 'YYYY-MM-DD hh:mm:ss') }}
            </div>
          </template></el-table-column
        >

        <el-table-column label="操作" width="160px">
          <!-- 通过scope可以获取当前行(row)数据 -->
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
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total,prev,pager,next,sizes,jumper"
        :total="usersTotalCount"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import useSystemStore from '@/store/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/date-format'
import { ElMessage } from 'element-plus'
import usePermissions from '@/hooks/usePermissions'
// 定义事件
const emit = defineEmits(['newBtnClick', 'editBtnClick', 'deleteBtnClick'])

// 分页器
const small = shallowRef(false)
const background = shallowRef(false)
const disabled = shallowRef(false)
const currentPage = shallowRef(1)
const pageSize = shallowRef(10)
function handleSizeChange() {
  fetchUserListData()
}
function handleCurrentChange() {
  fetchUserListData()
}
// 0.获取是否存在对应的增删改查的权限

const isCreate = usePermissions('system:users:create')

const isDelete = usePermissions('system:users:delete')

const isUpdate = usePermissions('system:users:update')

const isQuery = usePermissions('system:users:query')

// 1.使用Pinia进行网络请求的统一管理，不要直接调用网络请求，以此达到业务页面各功能模块的解耦
// 先获取pinia的systemStore对象
const systemStore = useSystemStore()
// 发起pinia的action，请求usersList的数据
fetchUserListData()

// 2.通过在pinia的systemStore对象中完成数据请求，再获取usersList的数据,进行展示
// 注意这里是分开执行的是异步操作，所以usersList的数据如果通过同步的方式获取最后得到是空的
/* 在 Pinia 中，storeToRefs 是一个辅助函数，
用于将 Pinia 存储（store）中的状态转换为响应式的引用（ref）。
它的作用是简化将存储状态绑定到组件模板中的过程。
当你在使用 Pinia 来管理应用程序的状态时，存储中的状态通常是响应式的 */
const { usersList, usersTotalCount } = storeToRefs(systemStore)

const tranferEnable = computed(() => {
  // 3.对usersList的数据进行处理，转换成表格需要的数据格式
  return (enable: number) => {
    return enable === 1 ? '启用' : '禁用'
  }
})

// 3.定义函数用于发送网络请求
// formData可能是空的，这里要进行默认数据判断处理
function fetchUserListData(formData: any = {}) {
  if (!isQuery) {
    return
  }
  // 1.获取offset/size
  const size = pageSize.value
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }
  // 2.发送网络请求
  const queryInfo = { ...pageInfo, ...formData }
  systemStore.postUsersListAction(queryInfo)
}
// 4.删除用户
async function handleDeleteClick(id: number) {
  /*
  当你使用 await systemstore.deleteuserbyidaction() 时，
  await 关键字会等待 Promise 对象(deleteUserById(id))的解析，并将解析后的值作为结果返回。
  在这种情况下，await 会等待 JSON 数据的解析完成，然后将解析后的数据作为结果返回给变量 delRes。
  如果不使用 await，而是直接访问 systemstore.deleteuserbyidaction() 的返回值，
  你将得到一个未解析的 Promise 对象，而不是实际的数据。
  因为 systemstore.deleteuserbyidaction() 是一个异步操作，
  返回的 Promise 对象可能在数据解析完成之前被访问，这样就无法获取到完整的数据。
  因此，为了确保在访问数据之前已经完成解析，需要使用 await 关键字来等待 Promise 对象的解析完成。
  这样，你可以确保 delRes 变量中保存的是解析后的数据，而不是 Promise 对象。
  */
  const delRes = await systemStore.deleteUserByIdAction(id)
  if (Number(delRes.code)) {
    ElMessage({
      message: delRes.data,
      type: 'error'
    })
    return
  }
  currentPage.value = 1
  pageSize.value = 10
  fetchUserListData()
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}
// 5.创建用户的操作
async function createNewUserClick() {
  emit('newBtnClick')
}
// 6.编辑用户的操作
async function handleEditClick(rowData: any) {
  emit('editBtnClick', rowData)
}
// 将该函数暴露出去，供其他组件使用
defineExpose({ fetchUserListData })
</script>

<style lang="less" scoped>
.content {
  margin-top: 20px;
  padding: 20px;
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
