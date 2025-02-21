<template>
  <div class="modal">
    <el-dialog
      @opened="$emit('dialog-opened')"
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
          :model="localFormData"
          ref="modalForm"
          :rules="formRules"
          :label-width="modalConfig.labelWidth ?? labelWidth"
          label-position="right"
        >
          <el-row :gutter="20">
            <!-- 添加 el-row 包裹 -->

            <template v-for="item in modalConfig.formItems" :key="item.prop">
              <el-col :span="item.span || item.span === 0 || 24">
                <el-form-item v-if="!item.hidden" :prop="item.prop">
                  <template #label>
                    <span>{{ item.label }}</span>
                  </template>
                  <template
                    #default
                    v-if="
                      item.type === 'input' &&
                      item.inputType !== 'number' &&
                      item.inputType !== 'textarea'
                    "
                  >
                    <el-input
                      :type="item.inputType ?? 'text'"
                      :disabled="item.disabled"
                      :maxLength="item.maxlength ?? null"
                      v-model="localFormData[item.prop]"
                      :placeholder="item.placeholder"
                    ></el-input>
                  </template>
                  <template
                    #default
                    v-else-if="
                      item.type === 'input' && item.inputType === 'number'
                    "
                  >
                    <el-input
                      type="number"
                      v-model.number="localFormData[item.prop]"
                      :placeholder="item.placeholder"
                      style="width: 100%"
                      @input="formatToTwoDecimalPlaces(item.prop)"
                    ></el-input>
                  </template>

                  <template
                    #default
                    v-else-if="
                      item.type === 'input' && item.inputType === 'textarea'
                    "
                  >
                    <el-input
                      type="textarea"
                      :rows="item.rows || 4"
                      :disabled="item.disabled"
                      :maxLength="item.maxlength ?? null"
                      v-model="localFormData[item.prop]"
                      :placeholder="item.placeholder"
                    ></el-input>
                  </template>

                  <template #default v-else-if="item.type === 'select'">
                    <el-select
                      v-model="localFormData[item.prop]"
                      :placeholder="item.placeholder"
                      :multiple="item.multiple"
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
                  <template #default v-else-if="item.type === 'cascader'">
                    <el-cascader
                      style="width: 100%"
                      v-model="localFormData[item.prop]"
                      :options="item.options"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      :props="item.props || {}"
                      clearable
                      popper-class="fixed-cascader-dropdown"
                      @change="(value: any) => handleValueChange(value, item.prop)"
                    />
                  </template>
                  <template #default v-else-if="item.type === 'radio'">
                    <el-radio-group v-model="localFormData[item.prop]">
                      <el-radio
                        v-for="radioOption in item.options"
                        :key="radioOption.value"
                        :label="radioOption.value"
                      >
                        {{ radioOption.label }}
                      </el-radio>
                    </el-radio-group>
                  </template>
                  <template #default v-else-if="item.type === 'date-picker'">
                    <el-date-picker
                      v-model="localFormData[item.prop]"
                      type="daterange"
                      format="YYYY-MM-DD"
                      :range-separator="item.rangeSeparator"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      size="default"
                      style="width: 100%"
                    />
                  </template>
                  <!--                   <template
                    #default
                    v-else-if="item.type === 'upload' && !item.tag"
                  >
                    <UploadImage
                      v-model:file-list="localFormData[item.prop]"
                      :max-count="item.maxCount || 5"
                      :multiple="item.multiple || false"
                      :allowed-types="
                        item.allowedTypes || ['image/jpeg', 'image/png']
                      "
                      @file-success="
                          (file:any) => handleUploadSuccess(file, item.prop)
                        "
                      @file-remove="
                          (file:any) => handleFileRemove(file, item.prop)
                        "
                    >
                    </UploadImage>
                  </template>
                  <template
                    #default
                    v-else-if="item.type === 'upload' && item.tag"
                  >
                    <UploadCommon
                      v-model:file-list="localFormData[item.prop]"
                      :max-count="item.maxCount || 5"
                      @file-success="
                          (file:any) => handleUploadSuccess(file, item.prop)
                        "
                      @file-remove="
                          (file:any) => handleFileRemove(file, item.prop)
                        "
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">{{
                          item.label
                        }}</el-button>
                      </template>
                    </UploadCommon>
                  </template> -->
                  <template #default v-else-if="item.type === 'custom'">
                    <slot
                      :name="item.slotName"
                      :form-data="localFormData"
                      :key="item.prop"
                    />
                  </template>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn-group" v-if="modalType === 'create'">
            <el-button @click="dialogClose">关闭</el-button>

            <el-button
              v-if="isSave"
              type="warning"
              @click="dialogSubmit(modalForm, '保存')"
              >保存</el-button
            >
            <el-button
              v-if="isSubmit"
              type="primary"
              @click="dialogSubmit(modalForm, '提交')"
              >提交</el-button
            >
          </div>
          <div
            class="btn-group"
            v-else-if="modalType !== 'create' && isOnlyCancel"
          >
            <el-button
              v-if="isCurrentUpdate"
              type="primary"
              @click="dialogSubmit(modalForm, currentRowStatus)"
              >更新</el-button
            >
            <el-button @click="dialogClose">关闭</el-button>
          </div>
          <div
            class="btn-group"
            v-else-if="modalType !== 'create' && !isOnlyCancel"
          >
            <el-button @click="dialogClose">关闭</el-button>
            <el-button
              v-if="isSave && isCurrentSave"
              type="warning"
              @click="dialogSubmit(modalForm, '保存')"
              >保存</el-button
            >
            <el-button
              v-if="isSubmit && !isCurrentUpdate"
              type="primary"
              @click="dialogSubmit(modalForm, '提交')"
              >提交</el-button
            >
            <el-button
              v-if="isUpdate && isCurrentUpdate"
              type="primary"
              @click="dialogSubmit(modalForm, currentRowStatus)"
              >更新</el-button
            >
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'
import type { IModalConfig } from './type'
import useSystemStore from '@/store/main/system'
import {
  ElForm,
  ElMessage,
  type FormInstance,
  type FormItemRule
} from 'element-plus'
import usePermissions from '@/hooks/usePermissions'
// import UploadCommon from '../upload-common/UploadCommon.vue'

// const isReadonly = computed(() => modalType.value === 'check')

// 0.定义props
interface extraNecessaryInfo {
  key: string
  extraKeyTooltips: string
}
// ... existing code ...
const props = withDefaults(
  defineProps<{
    modalConfig: IModalConfig
    resId?: string
    contentConfig: Record<string, any>
    formData: Record<string, any>
    prevAddress?: string
    isOnlyCancel?: boolean
    isCurrentSave?: boolean
    isCurrentUpdate?: boolean
    extraNecessaryInfo?: extraNecessaryInfo
    resetSlots: Function
    currentRowStatus?: string
  }>(),
  {
    isCurrentSave: true
  }
)
// ... existing code ...

const emit = defineEmits<{
  'create-btn-click': []
  'edit-btn-click': []
  'dialog-close': []
  'dialog-opened': []
}>()

// 获取表单的ref
const modalForm = ref<FormInstance>()
const hasMounted = ref(false)

// 1.定义模态框相关数据
const dialogVisible = shallowRef(false)
// 定义form的数据
let localFormData = reactive<Record<string, any>>({})
const labelWidth = 'auto'

watch(
  () => props.formData,
  (newVal) => {
    if (modalType.value === 'check') {
      if (hasMounted.value) {
        Object.assign(localFormData, newVal)

        hasMounted.value = false
      }
    }

    Object.keys(localFormData).forEach((key) => {
      const isPropInFormItems = props.modalConfig.formItems.some(
        (item) => item.prop === key && item.type !== 'custom'
      )
      if (!isPropInFormItems) {
        localFormData[key] = newVal[key]
      }
    })
  },
  { deep: true }
)

watch(
  () => props.modalConfig.formItems,
  (newItems) => {
    newItems.forEach((item) => {
      if (item.hidden && localFormData[item.prop] !== item.initialValue) {
        // 如果 hidden 为 true，重置对应的值为 initialValue
        localFormData[item.prop] = item.initialValue ?? null
      }
    })
  }
)

// 定义form的校验规则
const generateNumberRules = (key: keyof typeof localFormData, item: any) => {
  const rules: FormItemRule[] = []
  if (item.required) {
    rules.push({
      required: true,
      message: item.placeholder ?? '此字段为必填项',
      trigger: item.type === 'input' ? 'blur' : 'change'
    })
  }

  // 如果存在自定义验证器，则添加
  if (item.validator && item.required) {
    rules.push({
      validator: item.validator
    })
  }

  if (item.type === 'input' && item.inputType === 'number') {
    rules.push({
      type: 'number',
      message: `${item.label} 必须是一个数字`,
      trigger: 'blur'
    })

    if (item.min !== undefined) {
      rules.push({
        type: 'number',
        min: item.min,
        message: `${item.label} 必须大于或等于 ${item.min}`,
        trigger: 'blur'
      })
    }

    if (item.max !== undefined) {
      rules.push({
        type: 'number',
        max: item.max,
        message: `${item.label} 必须小于或等于 ${item.max}`,
        trigger: 'blur'
      })
    }
  }

  return rules
}

// 在循环中应用统一生成规则
const formRules = reactive<Record<string, FormItemRule[]>>({})
for (const item of props.modalConfig.formItems) {
  const key = item.prop as keyof typeof localFormData
  formRules[key] = generateNumberRules(key, item)
}

// 利用深拷贝将initialForm的值赋值给formData
// 定义编辑/新增的区分状态
const modalType = shallowRef('')
// 获取mainStore中的数据
// const mainStore = useMainStore()
// 获取systemStore中的数据
const systemStore = useSystemStore()
// 利用pinia的storeToRefs保持取出数据的响应式特性
// const { entireDepartments } = storeToRefs(mainStore)

// 2.定义设置dialogVisible的方法
function setModalVisible(rowData: any = {}, type: string) {
  hasMounted.value = true

  switch (type) {
    case 'new':
      modalType.value = 'create'
      for (const item of props.modalConfig.formItems) {
        localFormData[item.prop as keyof typeof localFormData] =
          item.initialValue ?? null
      }
      break
    case 'edit':
      modalType.value = 'edit'

      break
    case 'check':
      modalType.value = 'check'
      break
    default:
      break
  }

  dialogVisible.value = true
}
function handleUploadSuccess(file: any, prop: string) {
  if (!Array.isArray(localFormData[prop])) {
    localFormData[prop] = []
  }
  const exists = localFormData[prop].some((item: any) => item.uid === file.uid)
  if (!exists) {
    localFormData[prop].push({ name: file.name, url: file.url, uid: file.uid })
  }
  const item = props.modalConfig.formItems.find((i) => i.prop === prop)
  if (item) {
    item.initialValue = []
  }
}
function formatToTwoDecimalPlaces(prop: string) {
  const value = localFormData[prop]
  if (typeof value === 'number') {
    localFormData[prop] = parseFloat(value.toFixed(2))
  }
}
function handleFileRemove(file: any, prop: string) {
  if (Array.isArray(localFormData[prop])) {
    localFormData[prop] = localFormData[prop].filter(
      (item: any) => item.uid !== file.uid
    )
  }
}
const handleValueChange = (value: any, prop: string) => {
  if (Array.isArray(value) && value.length > 0) {
    localFormData[prop] = value[value.length - 1]
  } else {
    localFormData[prop] = value
  }
}
function dialogClose() {
  dialogVisible.value = false

  // 清空并初始化表单数据
  for (const item of props.modalConfig.formItems) {
    const key = item.prop as keyof typeof localFormData

    // 如果是上传组件，确保清空文件列表
    if (item.type === 'upload') {
      localFormData[key] = [] // 清空上传文件列表
    } else if (Array.isArray(localFormData[key])) {
      localFormData[key] = [] // 清空数组
    } else if (
      typeof localFormData[key] === 'object' &&
      localFormData[key] !== null
    ) {
      localFormData[key] = null
    } else {
      localFormData[key] = item.initialValue ?? null
    }
  }

  // 重置表单校验状态
  modalForm.value?.resetFields()
  modalForm.value?.clearValidate()

  // 发出关闭事件
  emit('dialog-close')
}
console.log('props.contentConfig', props.contentConfig)

const isSubmit = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:submit`
)
const isSave = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:save`
)
const isUpdate = usePermissions(
  `${props.contentConfig.pageName}:${props.contentConfig.middleName}:update`
)
async function dialogSubmit(formEl: FormInstance | undefined, status?: string) {
  if (!formEl) {
    return
  }
  // 从 modalConfig 中获取需要保留的隐藏字段
  const hiddenFields = props.modalConfig.formItems
    .filter((item) => item.hidden && item.label === '')
    .map((item) => item.prop)

  hiddenFields.forEach((field) => {
    if (!(field in localFormData)) {
      localFormData[field] = props.formData[field] || ''
    }
  })
  if (props.prevAddress && localFormData?.address) {
    localFormData.address = props.prevAddress
  }
  if (status === '保存') {
    const infoData = { ...localFormData }

    hiddenFields.forEach((field) => {
      if (!(field in infoData)) {
        infoData[field] = props.formData[field] || ''
      }
    })

    if (modalType.value === 'create') {
      const res = await systemStore.newPageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (Number(res.code) !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success('保存成功')
      emit('create-btn-click')
    } else if (modalType.value === 'edit') {
      const res = await systemStore.editPageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (res.code !== 200) {
        ElMessage.error(res.message || '请求失败')
        return
      }
      ElMessage.success('保存成功')
      emit('edit-btn-click')
    } else if (modalType.value === 'check') {
      const res = await systemStore.savePageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (res.code !== 200) {
        ElMessage.error(res.message || '请求失败')
        return
      }
      const useStore = useSystemStore()
      useStore.changeFirstLoad()
      ElMessage.success('修改成功')
      emit('edit-btn-click')
    }

    dialogClose()
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      ElMessage.error('表单校验未通过，请检查输入内容')
      return
    }
    if (
      props.extraNecessaryInfo &&
      !localFormData[props.extraNecessaryInfo.key]
    ) {
      ElMessage.error(props.extraNecessaryInfo.extraKeyTooltips)
      return
    }
    let infoData = { ...localFormData }

    hiddenFields.forEach((field) => {
      if (!(field in infoData)) {
        infoData[field] = props.formData[field] || ''
      }
    })

    if (props.prevAddress && infoData?.address) {
      infoData.address = props.prevAddress
    }

    if (modalType.value === 'create') {
      const res = await systemStore.newPageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (Number(res.code) !== 200) {
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
        localFormData.type = null
      }
      const res = await systemStore.editPageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (res.code !== 200) {
        ElMessage.error(res.message || '请求失败')
        return
      }
      const useStore = useSystemStore()
      useStore.changeFirstLoad()
      ElMessage.success('修改成功')
      emit('edit-btn-click')
    } else if (modalType.value === 'check') {
      const res = await systemStore.savePageDataAction(
        props.modalConfig.pageName,
        { ...infoData, status }
      )
      if (res.code !== 200) {
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
  })
}

// 暴露的属性和方法
defineExpose({ setModalVisible })
</script>

<style lang="less" scoped>
.form {
  padding: 10px 30px;
  :global(.el-form-item) {
    padding: 0; /* 移除 padding，防止影响宽度 */
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
