<template>
  <div class="modal">
    <el-dialog
      v-model="dialogVisible"
      :title="modalType === 'create' ? '新建用户' : '编辑用户'"
      width="40%"
      center
    >
      <div class="form">
        <el-form
          :model="formData"
          ref="modalForm"
          label-width="80px"
          :rules="formRules"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realname">
            <el-input
              v-model="formData.realname"
              placeholder="请输入真实姓名"
            />
          </el-form-item>
          <el-form-item
            label="登录密码"
            prop="password"
            v-if="modalType === 'create'"
          >
            <el-input
              v-model="formData.password"
              placeholder="请输入登录密码"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="cellphone">
            <el-input
              v-model="formData.cellphone"
              placeholder="请输入手机号码"
            />
          </el-form-item>
          <el-form-item label="选择角色" prop="role_id">
            <el-select
              v-model="formData.role_id"
              placeholder="请选择角色"
              style="width: 100%"
            >
              <template v-for="item in entireRoles" :key="item.id">
                <el-option :value="item.id" :label="item.name" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="选择部门" prop="departmentId">
            <el-select
              v-model="formData.departmentId"
              placeholder="请选择部门"
              style="width: 100%"
            >
              <template v-for="item in entireDepartments" :key="item.id">
                <el-option :value="item.id" :label="item.name" />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">关闭</el-button>
          <el-button type="primary" @click="dialogSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import useMainStore from '@/store/main/main'
import useSystemStore from '@/store/main/system/system'
import { ElForm, ElMessage, type FormRules } from 'element-plus'

const emit = defineEmits(['create-btn-click', 'edit-btn-click'])
// 获取表单的ref
const modalForm = ref<InstanceType<typeof ElForm>>()
// 1.定义模态框相关数据
const dialogVisible = shallowRef(false)
let formData = reactive<any>({
  name: '',
  realname: '',
  password: '',
  cellphone: '',
  role_id: '',
  departmentId: ''
})
const editData = shallowRef()
// 定义编辑/新建的区分状态
const modalType = shallowRef('')
// 获取mainStore中的数据
const mainStore = useMainStore()
// 获取systemStore中的数据
const systemStore = useSystemStore()
// 利用pinia的storeToRefs保持取出数据的响应式特性
const { entireRoles, entireDepartments } = storeToRefs(mainStore)
const formRules: FormRules = {
  realname: [{ required: true, message: '必须输入真实姓名', trigger: 'blur' }]
}
// 2.定义设置dialogVisible的方法
function setModalVisible(rowData: any = {}) {
  // vue3中利用Object.keys()解析reactive对象可以获取对象的所有属性的名称
  const isEmptyRow = Object.keys(rowData).length === 0
  if (!isEmptyRow) {
    modalType.value = 'edit'
    for (const key in formData) {
      formData[key] = rowData[key]
    }
    formData.id = rowData.id
    // 将rowData赋值给editData
    editData.value = reactive(formData)
  } else {
    modalType.value = 'create'
    for (const key in formData) {
      formData[key] = ''
    }
    editData.value = null
  }
  dialogVisible.value = true
}
function dialogClose() {
  // 将Modal隐藏并且清空表单
  dialogVisible.value = false
  modalForm.value?.resetFields()
}
async function dialogSubmit() {
  modalForm.value?.validate(async (valid) => {
    if (valid) {
      if (modalType.value === 'create') {
        // 提交创建结果
        const res = await systemStore.createUserDataAction(formData)
        if (Number(res.code)) {
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('创建成功')
        emit('create-btn-click')
      } else {
        const res = await systemStore.editUserDataAction(
          editData.value?.id,
          formData
        )
        if (Number(res.code)) {
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('修改成功')
        emit('edit-btn-click')
      }
      // 将Modal隐藏并且清空表单
      dialogClose()
    }
  })
}

// 暴露的属性和方法
defineExpose({ setModalVisible })
</script>

<style lang="less" scoped>
.form {
  padding: 10px 30px;
  padding-right: 0;
  :global(.el-dialog__body) {
    padding: 15px 20px;
    padding-right: 22px;
  }
  .el-form-item {
    padding: 10px 20px;
    padding-right: 0;
  }
  :global(.el-dialog__footer) {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 20px;
    padding-right: 20px;
  }
}
</style>
