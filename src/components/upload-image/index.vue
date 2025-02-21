<template>
  <div class="upload-container" :class="{ 'is-uploading': isUploading }">
    <el-upload
      ref="uploadImageRef"
      v-model:file-list="internalFileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :http-request="upload"
      :multiple="multiple"
      :limit="computedLimit"
      accept="image/jpeg, image/png, image/gif"
      list-type="picture-card"
      :show-file-list="true"
    >
      <template v-if="multiple || (!multiple && !internalFileList.length)">
        <slot name="trigger">
          <div v-if="!isUploading" class="upload-trigger">
            <el-button
              size="small"
              type="primary"
              :loading="isUploading"
              :disabled="isUploading"
            >
              {{ isUploading ? '上传中...' : '点击上传' }}
            </el-button>
          </div>
          <div v-else-if="isUploading" class="upload-trigger upload-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
        </slot>
      </template>

      <template #file="{ file }">
        <div class="el-upload-list__item">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <el-icon><zoom-in /></el-icon>
            </span>

            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useUpload } from '@/utils/useUpload'
import { ElMessage } from 'element-plus'
import { Delete, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

// Props for customization
const props = defineProps({
  fileList: {
    type: Array as () => { name: string; url?: string; uid?: string }[],
    default: () => []
  },
  maxCount: {
    type: Number,
    default: Infinity
  },
  allowedTypes: {
    type: Array as () => string[],
    default: () => ['image/jpeg', 'image/png', 'image/gif']
  },
  multiple: {
    type: Boolean,
    default: true
  }
})
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const computedLimit = computed(() => (props.multiple ? props.maxCount : 1))

// Emits for parent component interaction
const emit = defineEmits<{
  (
    e: 'update:fileList',
    fileList: { name: string; url?: string; uid?: string }[]
  ): void
  (e: 'change', fileList: { name: string; url?: string; uid?: string }[]): void
  (e: 'file-success', file: any): void
  (e: 'file-remove', file: any): void
}>()
// Internal state
const internalFileList = ref<{ name: string; url?: string; uid?: string }[]>([])
const { upload, isUploading } = useUpload()

// Watch for external fileList changes
watch(
  () => props.fileList,
  (newFileList) => {
    if (newFileList && Array.isArray(newFileList)) {
      // 确保 newFileList 是数组
      internalFileList.value = [...newFileList]
    } else {
      // 如果不是数组（可能是 null 或 undefined），重置 internalFileList 为空数组
      internalFileList.value = []
    }
  },
  { deep: true, immediate: true }
)

// Before upload hook for custom validation
const beforeUpload = (file: File) => {
  console.log('internalFileList.value', internalFileList.value)

  if (internalFileList.value.length >= props.maxCount) {
    ElMessage.error(`最多上传 ${props.maxCount} 个文件`)
    return false
  }
  if (!props.allowedTypes.includes(file.type)) {
    ElMessage.error('不支持的文件类型，请上传常见的图片格式')
    return false
  }
  return true
}
const handlePictureCardPreview = (file: UploadFile) => {
  if (file.url) {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  }
}
const handleSuccess = (response: string, file: any, fileList: any) => {
  if (!response) {
    return
  }

  // 创建一个文件的副本并更新其属性
  const updatedFile = { ...file, url: response, status: 'success' }

  // 在 internalFileList 中找到相应的文件并更新
  const index = internalFileList.value.findIndex((f) => f.uid === file.uid)
  if (index !== -1) {
    internalFileList.value.splice(index, 1, updatedFile)
  } else {
    internalFileList.value.push(updatedFile)
  }

  // Emit events
  emit('file-success', updatedFile)
  // emit('update:fileList', internalFileList.value)
  // emit('change', internalFileList.value)
}

// Handle file remove
const handleRemove = (file: UploadFile) => {
  // 找到要删除的文件的索引
  const index = internalFileList.value.findIndex(
    (f) => Number(f.uid) == file.uid
  )

  if (index !== -1) {
    // 更新 internalFileList
    internalFileList.value.splice(index, 1)
  }
  console.log(' internalFileList.value', internalFileList.value)

  emit('file-remove', file)
  emit('update:fileList', internalFileList.value)
}

defineExpose({
  uploadAll: () => {
    const uploadRef = ref<any>()
    uploadRef.value?.submit()
  },
  internalFileList
})
</script>
<style lang="less" scoped>
.el-upload-list__item {
  margin: 0;
}
// 添加这个样式，当只有一张图片时隐藏上传框的边框
:deep(.el-upload--picture-card) {
  display: v-bind("multiple || !internalFileList.length ? 'block' : 'none'");
}

.el-upload-list__item-actions {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  .el-upload-list__item-preview {
    position: relative;
  }
  .el-upload-list__item-delete {
    position: relative;
    margin-left: 0;
  }
}
.upload-trigger {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
