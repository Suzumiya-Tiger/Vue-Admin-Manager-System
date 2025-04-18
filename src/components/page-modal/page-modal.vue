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
              <el-col
                v-if="!item.hidden"
                :span="item.span || item.span === 0 || 24"
              >
                <el-form-item
                  v-if="!item.hidden"
                  :prop="item.prop"
                  :label-width="item.labelWidth"
                >
                  <template #label>
                    <span>{{ item.btnLabel ?? item.label }}</span>
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
                      @input="(val: any) => handleNumberInput(val, item)"
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
                  <template #default v-else-if="item.type === 'checkbox'">
                    <el-checkbox
                      v-model="localFormData[item.prop]"
                      :true-label="'是'"
                      :false-label="'否'"
                    >
                      {{ item.label }}
                    </el-checkbox>
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
                  <template
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
                    v-else-if="item.type === 'upload' && item.tag === 'common'"
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
                  </template>
                  <template
                    #default
                    v-else-if="item.type === 'upload' && item.tag === 'file'"
                  >
                    <UploadFile
                      v-model:file-list="localFormData[item.prop]"
                      :max-count="item.maxCount || 5"
                      :allowed-types="item.allowedTypes || ['application/pdf']"
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
                    </UploadFile>
                  </template>
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
              v-if="isSubmit"
              type="primary"
              @click="dialogSubmit(modalForm, '提交')"
              >提交</el-button
            >
          </div>

          <div class="btn-group" v-else-if="modalType !== 'create'">
            <el-button @click="dialogClose">关闭</el-button>

            <el-button
              v-if="isSubmit"
              type="primary"
              @click="dialogSubmit(modalForm, '提交')"
              >提交</el-button
            >
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  shallowRef,
  watch,
  nextTick,
  toRaw,
  computed
} from 'vue'
import type { IModalConfig } from './type'
import useSystemStore from '@/store/main/system'
import {
  ElForm,
  ElMessage,
  type FormInstance,
  type FormItemRule
} from 'element-plus'
import usePermissions from '@/hooks/usePermissions'
import UploadCommon from '../upload-common/UploadCommon.vue'
import UploadFile from '../upload-file/UploadFile.vue'
import { debounce } from 'lodash'

// 0.定义props
interface extraNecessaryInfo {
  key: string
  extraKeyTooltips: string
}

const props = withDefaults(
  defineProps<{
    modalConfig: IModalConfig
    resId?: string
    contentConfig: Record<string, any>
    formData: Record<string, any>
    prevAddress?: string
    extraNecessaryInfo?: extraNecessaryInfo
    resetSlots?: Function
    currentRowStatus?: string
  }>(),
  {}
)

const emit = defineEmits<{
  'create-btn-click': []
  'edit-btn-click': []
  'dialog-close': []
  'dialog-opened': []
}>()

const modalForm = ref<FormInstance>()
const dialogVisible = shallowRef(false)
let localFormData = reactive<Record<string, any>>({})
const labelWidth = 'auto'

// --- 新增状态 ---
const isInitializing = ref(false)
const watchDebounceTimer = ref<number | null>(null)

// --- 更新 watch 逻辑 ---
watch(
  () => props.formData,
  (newVal) => {
    if (isInitializing.value) return

    if (watchDebounceTimer.value) {
      clearTimeout(watchDebounceTimer.value)
    }

    watchDebounceTimer.value = window.setTimeout(() => {
      const customProps = props.modalConfig.formItems
        .filter((item) => item.type === 'custom')
        .map((item) => item.prop)

      customProps.forEach((prop) => {
        if (prop in newVal) {
          localFormData[prop] = newVal[prop]
        }
      })

      watchDebounceTimer.value = null
    }, 50)
  },
  { deep: true }
)

watch(
  () => props.modalConfig.formItems,
  (newItems) => {
    newItems.forEach((item) => {
      if (item.hidden && localFormData[item.prop] !== item.initialValue) {
        localFormData[item.prop] = item.initialValue ?? null
      }
    })
  },
  { deep: true, immediate: true }
)

// --- 新增：动态生成验证规则 ---
const generateNumberRules = (
  key: keyof typeof localFormData,
  item: any
): FormItemRule[] => {
  const rules: FormItemRule[] = []

  if (item.validator) {
    rules.push({
      required: item.required ?? false,
      validator: item.validator,
      trigger: ['blur', 'change']
    })
    return rules
  }

  if (item.required) {
    const trigger =
      ['input', 'textarea'].includes(item.type) ||
      (item.type === 'input' && item.inputType === 'number')
        ? 'blur'
        : [
            'select',
            'cascader',
            'date-picker',
            'radio',
            'checkbox',
            'upload'
          ].includes(item.type)
        ? 'change'
        : 'blur'

    rules.push({
      required: true,
      message: item.placeholder ?? `请输入${item.label}`,
      trigger: trigger
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

// --- 更新：初始化 formRules ---
const formRules = reactive<Record<string, FormItemRule[]>>({})
watch(
  () => props.modalConfig.formItems,
  (newItems) => {
    for (const key in formRules) {
      delete formRules[key]
    }
    for (const item of newItems) {
      if (!item.hidden) {
        const key = item.prop as keyof typeof localFormData
        formRules[key] = generateNumberRules(key, item)
      }
    }
  },
  { deep: true, immediate: true }
)

const modalType = shallowRef('')
const systemStore = useSystemStore()

// --- 更新 setModalVisible 方法 ---
function setModalVisible(rowData: any = {}, type: string) {
  isInitializing.value = true
  modalType.value = type === 'new' ? 'create' : type

  for (const item of props.modalConfig.formItems) {
    const key = item.prop as keyof typeof localFormData
    if (item.type === 'upload') {
      localFormData[key] = []
    } else if (Array.isArray(item.initialValue)) {
      localFormData[key] =
        item.initialValue.length > 0 ? [...item.initialValue] : []
    } else if (
      typeof item.initialValue === 'object' &&
      item.initialValue !== null
    ) {
      localFormData[key] = JSON.parse(JSON.stringify(item.initialValue))
    } else {
      localFormData[key] =
        item.initialValue !== undefined ? item.initialValue : null
    }
  }

  if (type === 'edit') {
    if (Object.keys(rowData).length > 0) {
      const allProps = props.modalConfig.formItems.map((item) => item.prop)
      for (const key in rowData) {
        if (allProps.includes(key)) {
          nextTick(() => {
            if (Array.isArray(rowData[key])) {
              localFormData[key] = [...rowData[key]]
            } else if (
              typeof rowData[key] === 'object' &&
              rowData[key] !== null
            ) {
              localFormData[key] = JSON.parse(JSON.stringify(rowData[key]))
            } else {
              localFormData[key] = rowData[key]
            }
          })
        }
      }
      if (rowData.id !== undefined) {
        localFormData.id = rowData.id
      }
    }
  }

  dialogVisible.value = true

  nextTick(() => {
    modalForm.value?.clearValidate()

    setTimeout(() => {
      isInitializing.value = false
    }, 50)
  })
}

function handleUploadSuccess(file: any, prop: string) {
  if (!Array.isArray(localFormData[prop])) {
    localFormData[prop] = []
  }
  const exists = localFormData[prop].some((item: any) => item.uid === file.uid)
  if (!exists) {
    localFormData[prop].push({ name: file.name, url: file.url, uid: file.uid })
  }
}

function handleFileRemove(file: any, prop: string) {
  if (Array.isArray(localFormData[prop])) {
    localFormData[prop] = localFormData[prop].filter(
      (item: any) => item.uid !== file.uid
    )
  }
}

function formatToTwoDecimalPlaces(prop: string) {
  const value = localFormData[prop]
  if (typeof value === 'number') {
    localFormData[prop] = parseFloat(value.toFixed(2))
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
      localFormData[key] = []
    } else if (Array.isArray(item.initialValue)) {
      localFormData[key] =
        item.initialValue.length > 0 ? [...item.initialValue] : []
    } else if (
      typeof item.initialValue === 'object' &&
      item.initialValue !== null
    ) {
      localFormData[key] = JSON.parse(JSON.stringify(item.initialValue))
    } else {
      localFormData[key] =
        item.initialValue !== undefined ? item.initialValue : null
    }
  }
  if (localFormData.id !== undefined) {
    localFormData.id = null
  }

  nextTick(() => {
    modalForm.value?.resetFields()
    modalForm.value?.clearValidate()
  })

  if (props.resetSlots && typeof props.resetSlots === 'function') {
    props.resetSlots()
  }

  emit('dialog-close')
}

const isSubmit = computed(() =>
  usePermissions(
    `${props.contentConfig.pageName}:${props.contentConfig.middleName}:submit`
  )
)

const isUpdate = computed(() =>
  usePermissions(
    `${props.contentConfig.pageName}:${props.contentConfig.middleName}:update`
  )
)

async function dialogSubmit(formEl: FormInstance | undefined, status?: string) {
  if (!formEl) return

  const valid = await formEl.validate().catch(() => false)

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

  let infoData = { ...toRaw(localFormData) }

  const hiddenFields = props.modalConfig.formItems
    .filter((item) => item.hidden && !item.label)
    .map((item) => item.prop)

  hiddenFields.forEach((field) => {
    if (!(field in infoData) && props.formData && field in props.formData) {
      infoData[field] = props.formData[field]
    }
  })

  try {
    let res: any = null
    const pageName = props.modalConfig.pageName

    if (modalType.value === 'create') {
      res = await systemStore.newPageDataAction(pageName, {
        ...infoData,
        status
      })
      if (Number(res?.code) === 200) {
        ElMessage.success('创建成功')
        emit('create-btn-click')
        dialogClose()
      } else {
        ElMessage.error(res?.message || '创建失败')
      }
    } else {
      const id = infoData.id ?? props.resId
      if (id === undefined || id === null) {
        ElMessage.error('无法获取记录ID，操作失败')
        return
      }
      res = await systemStore.editPageDataAction(pageName, id, {
        ...infoData,
        status
      })
      if (Number(res?.code) === 200) {
        ElMessage.success('修改成功')
        emit('edit-btn-click')
        dialogClose()
      } else {
        ElMessage.error(res?.message || '修改失败')
      }
    }
  } catch (error: any) {
    console.error('Dialog submit error:', error)
    ElMessage.error(error.message || '操作执行失败')
  }
}

const handleNumberInput = debounce((val: any, item: any) => {
  if (val === '' || val === null || val === undefined) return

  const prop = item.prop

  if (item.numberFormat) {
    const { integerLimit = 2, decimalLimit = 2 } = item.numberFormat

    // 将输入值转为字符串
    let strValue = val.toString()

    // 检查是否包含小数点
    if (strValue.includes('.')) {
      const [intPart, decPart] = strValue.split('.')

      // 限制整数部分位数
      if (intPart.length > integerLimit) {
        strValue = intPart.substring(0, integerLimit) + '.' + decPart
      }

      // 限制小数部分位数
      if (decPart.length > decimalLimit) {
        strValue = intPart + '.' + decPart.substring(0, decimalLimit)
      }

      localFormData[prop] = parseFloat(strValue)
    } else {
      // 如果没有小数点，只限制整数部分
      if (strValue.length > integerLimit) {
        localFormData[prop] = parseFloat(strValue.substring(0, integerLimit))
      }
    }
  } else {
    formatToTwoDecimalPlaces(prop)
  }
}, 300)

defineExpose({ setModalVisible })
</script>

<style lang="less" scoped>
.form {
  padding: 10px 30px;
  :global(.el-form-item) {
    padding: 0;
    margin-bottom: 18px;
  }

  .el-form-item {
    padding: 10px 20px;
    padding-right: 0;
  }

  .dialog-footer {
    text-align: right;
    padding: 10px 20px;
    border-top: 1px solid #ebeef5;
    .btn-group {
      display: inline-block;
      .el-button + .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
