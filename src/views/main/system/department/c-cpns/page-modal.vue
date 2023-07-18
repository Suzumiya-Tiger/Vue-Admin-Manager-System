<template>
  <div class="modal">
    <el-dialog
      v-model="dialogVisible"
      :title="modalType === 'create' ? '新建部门' : '编辑部门'"
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
          <el-form-item label="部门" prop="name">
            <el-input v-model="formData.name" placeholder="请输入部门" />
          </el-form-item>
          <el-form-item label="部门领导" prop="leader">
            <el-input v-model="formData.leader" placeholder="请输入部门领导" />
          </el-form-item>

          <el-form-item label="上级部门" prop="parentId">
            <el-select
              v-model="formData.parentId"
              placeholder="请选择上级部门"
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
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useMainStore from '@/store/main/main'
import useSystemStore from '@/store/main/system/system'
import { ElForm, ElMessage, type FormRules } from 'element-plus'

const emit = defineEmits(['create-btn-click', 'edit-btn-click'])
// 获取表单的ref
const modalForm = ref()
// 1.定义模态框相关数据
const dialogVisible = ref(false)
let formData = reactive<any>({
  name: '',
  leader: '',
  parentId: ''
})
const editData = ref()
// 定义编辑/新建的区分状态
const modalType = ref('')
// 获取mainStore中的数据
const mainStore = useMainStore()
// 获取systemStore中的数据
const systemStore = useSystemStore()
// 利用pinia的storeToRefs保持取出数据的响应式特性
const { entireDepartments } = storeToRefs(mainStore)
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
    editData.value = rowData
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
  if (modalType.value === 'create') {
    // 提交创建结果
    const res = await systemStore.newPageDataACtion('department', formData)
    if (Number(res.code)) {
      ElMessage.error(res.data)
      return
    }
    ElMessage.success('创建成功')
    emit('create-btn-click')
  } else {
    const res = await systemStore.editPageDataAction(
      'department',
      editData.value?.id,
      formData
    )
    if (Number(res.code)) {
      ElMessage.error(res.data)
      return
    }
    ElMessage.success('修改成功')
    emit('edit-btn-click')
  }
  // 将Modal隐藏并且清空表单
  dialogClose()
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
