<template>
  <div class="modal">
    <el-dialog
      @closed="dialogClose"
      v-model="dialogVisible"
      :title="
        modalType === 'create'
          ? modalConfig.header.newTitle
          : modalConfig.header.editTitle
      "
      :width="modalConfig.width ?? '600px'"
      center
    >
      <div class="form">
        <el-form
          :model="formData"
          ref="modalForm"
          label-width="80px"
          :rules="formRules"
        >
          <template v-for="item in modalConfig.formItems" :key="item.prop">
            <el-form-item :prop="item.prop">
              <template #label v-if="!item.hidden">
                <span>{{ item.label }}</span>
              </template>
              <template #default v-if="item.type === 'input'">
                <el-input
                  v-model="formData[item.prop]"
                  :placeholder="item.placeholder"
                ></el-input>
              </template>
              <!-- 自定义组件 -->
              <template #default v-else-if="item.type === 'custom'">
                <slot :name="item.slotName"></slot>
              </template>

              <template #default v-else-if="item.type === 'date-picker'">
                <el-date-picker
                  v-model="formData[item.prop]"
                  type="daterange"
                  format="YYYY-MM-DD"
                  :range-separator="item.rangeSeparator"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="default"
                />
              </template>
              <template
                #default
                v-else-if="item.type === 'select' && isShow(item)"
              >
                <el-select
                  v-model="formData[item.prop]"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                >
                  <template
                    v-for="itemOption in item.options"
                    :key="itemOption.value"
                  >
                    <el-option
                      :label="itemOption.label"
                      :value="itemOption.value"
                    ></el-option>
                  </template>
                </el-select>
              </template>
            </el-form-item>
          </template>
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
import { computed, reactive, ref, shallowRef } from 'vue'
import type { IModalProps, formItemType } from './type'
import useSystemStore from '@/store/main/system/system'
import { ElForm, ElMessage, type FormRules } from 'element-plus'
const isShow = computed(() => {
  return (item: formItemType) => {
    if (item.prop !== 'sort') {
      return true
    } else {
      return formData.type !== 1
    }
  }
})

// 0.定义props
const props = defineProps<IModalProps>()
const emit = defineEmits(['create-btn-click', 'edit-btn-click'])
// 获取表单的ref
const modalForm = ref<InstanceType<typeof ElForm>>()

// 1.定义模态框相关数据
const dialogVisible = shallowRef(false)
// 定义form的数据
const formData = reactive({ id: null, type: null })

// 定义form的校验规则
const formRules: FormRules = {}
for (const item of props.modalConfig.formItems) {
  // 初始化initialForm的数据
  formData[item.prop] = item.initialValue ?? null
  /* 格式化formRules的数据 */
  item.required
    ? (formRules[item.label] = [
        {
          required: true,
          message: item.placeholder,
          trigger: item.type === 'input' ? 'blur' : 'change'
        }
      ])
    : null
}

// 利用深拷贝将initialForm的值赋值给formData
// 定义编辑/新建的区分状态
const modalType = shallowRef('')
// 获取mainStore中的数据
// const mainStore = useMainStore()
// 获取systemStore中的数据
const systemStore = useSystemStore()
// 利用pinia的storeToRefs保持取出数据的响应式特性
// const { entireDepartments } = storeToRefs(mainStore)

// 2.定义设置dialogVisible的方法
function setModalVisible(rowData: any = {}) {
  // vue3中利用Object.keys()解析reactive对象可以获取对象的所有属性的名称
  const isEmptyRow = Object.keys(rowData).length === 0
  // 判断是否是新建还是编辑
  if (!isEmptyRow) {
    modalType.value = 'edit'
    for (const key in formData) {
      formData[key] = rowData[key]
    }
    formData.id = rowData.id
    if (rowData.type && rowData.type === 1 && rowData.sort) {
      formData.type = rowData.type
    }
    // 将rowData赋值给editData
  } else {
    modalType.value = 'create'
    // 对新建的数据进行初始化
  }
  dialogVisible.value = true
}
function dialogClose() {
  // 将Modal隐藏并且清空表单
  dialogVisible.value = false
  for (const item of props.modalConfig.formItems) {
    // 初始化initialForm的数据
    formData[item.prop] = item.initialValue ?? null
  }
  modalForm.value?.clearValidate()
}
async function dialogSubmit() {
  let infoData = { ...formData }
  if (props.modalConfig.customFormItemName) {
    if (Array.isArray(props.modalConfig.propSlotData)) {
      infoData[props.modalConfig.customFormItemName] = [
        ...props.modalConfig.propSlotData
      ]
    }
  }
  if (modalType.value === 'create') {
    // 提交创建结果
    const res = await systemStore.newPageDataAction(
      props.modalConfig.pageName,
      infoData
    )
    if (Number(res.code)) {
      ElMessage.error(res.message)
      return
    }
    const useStore = useSystemStore()
    useStore.changeFirstLoad()
    ElMessage.success('创建成功')
    emit('create-btn-click')
  } else if (modalType.value === 'edit') {
    /* 针对菜单管理修改的过滤 */
    if (props.modalConfig.pageName === 'menu') {
      formData.type = null
    }
    const res = await systemStore.editPageDataAction(
      props.modalConfig.pageName,
      formData.id ?? 0,
      infoData
    )
    if (res.code) {
      ElMessage.error(res.message || '请求失败')
      return
    }
    const useStore = useSystemStore()
    useStore.changeFirstLoad()
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
