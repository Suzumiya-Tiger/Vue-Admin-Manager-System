<template>
  <div class="upload-container">
    <el-upload
      ref="uploadImageRef"
      v-model:file-list="internalFileList"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :http-request="upload"
      :multiple="true"
      :show-file-list="true"
    >
      <slot name="trigger">
        <el-button size="small" type="primary">点击上传</el-button>
      </slot>
      <template #file="{ file }">
        <el-row
          class="upload-item"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <el-col :span="16">
            <el-tooltip :content="file.name" placement="top">
              <span
                style="cursor: pointer; color: #409eff"
                @click="handleView(file)"
                >{{ file.name }}</span
              >
            </el-tooltip>
          </el-col>
          <el-col :span="8" class="actions">
            <span v-if="file.status === 'uploading'">上传中，请稍候...</span>
            <span v-else-if="file.status === 'success'">
              <el-icon :style="{ color: 'green' }">
                <Check />
              </el-icon>
              上传成功
            </span>
            <!-- 删除按钮 -->
            <el-button size="mini" @click="handleRemove(file)" circle
              >删除</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useUpload } from '@/utils/useUpload'
import { ElMessage } from 'element-plus'

// Props for customization
const props = defineProps({
  fileList: {
    type: Array as () => { name: string; url?: string; uid?: string }[],
    default: () => []
  },
  maxCount: {
    type: Number,
    default: Infinity
  }
})

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

const { upload } = useUpload()

// Handle file view
const handleView = (file: any) => {
  if (file.url) {
    window.open(file.url, '_blank') // 在新标签页打开文件
  } else {
    ElMessage.error('资源仍在上传中，请稍后再试')
  }
}

// Watch for external fileList changes
watch(
  () => props.fileList,
  (newFileList) => {
    if (newFileList && Array.isArray(newFileList)) {
      internalFileList.value = [...newFileList]
    } else {
      internalFileList.value = []
    }
  },
  { deep: true, immediate: true }
)

// Before upload hook for custom validation
const beforeUpload = (file: File) => {
  if (internalFileList.value.length >= props.maxCount) {
    ElMessage.error(`最多上传 ${props.maxCount} 个文件`)
    return false
  }
  // Set the status to 'uploading' to show "上传中" while uploading
  const newFile = { ...file, status: 'uploading' }
  internalFileList.value.push(newFile)
  return true
}

// Handle file success
const handleSuccess = (response: string, file: any) => {
  if (!response) {
    return
  }

  // Update the file status to 'success' when the upload completes
  const updatedFile = { ...file, url: response, status: 'success' }
  const index = internalFileList.value.findIndex((f) => f.uid === file.uid)
  if (index !== -1) {
    internalFileList.value.splice(index, 1, updatedFile)
  } else {
    internalFileList.value.push(updatedFile)
  }

  emit('file-success', updatedFile)
}

// Handle file remove
const handleRemove = (file: any) => {
  const updatedList = internalFileList.value.filter(
    (item) => item.uid !== file.uid
  )
  internalFileList.value = updatedList

  emit('file-remove', file)
  emit('update:fileList', updatedList)
}

// Expose public methods for parent components
defineExpose({
  uploadAll: () => {
    const uploadRef = ref<any>()
    uploadRef.value?.submit()
  },
  internalFileList
})
</script>

<style lang="less" scoped>
::v-deep .upload-container {
  max-width: 800px !important;
}

::v-deep .el-upload-list {
  min-width: 400px !important;

  max-width: 800px !important;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px; /* 调整按钮之间的间隔 */
}

.el-button {
  text-align: center;
  font-size: 12px; /* 缩小按钮文字 */
  padding: 5px; /* 增加按钮的内边距 */
}
</style>
