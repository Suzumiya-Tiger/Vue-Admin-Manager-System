<template>
  <div class="department">
    <page-search
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    ></page-search>
    <page-content
      :content-config="contentConfig"
      ref="contentRef"
      @new-btn-click="handleNewClick"
      @edit-btn-click="handleEditClick"
    >
      <!-- 先在被调用的组件之中定一个具名插槽，
      用于获取组件实例内部的特殊scope定制(el-table-column) -->
      <template #parent="scope">
        <span>{{ scope.row.parentId ? '存在' : '不存在' }}</span>
      </template>
    </page-content>
    <page-modal
      ref="modalRef"
      :modal-config="modalConfigRef"
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
    ></page-modal>
  </div>
</template>

<script setup lang="ts" name="department">
import { ref, computed } from 'vue'
import useMainStore from '@/store/main/main'

// 1.导入组件(vueComponent)
// 2.导入数据通用配置(config)
// 3.导入交互逻辑(hooks)import PageSearch from '@/components/page-search/page-search.vue'
import PageContent from '@/components/page-content/page-content.vue'
import PageModal from '@/components/page-modal/page-modal.vue'

import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
import modalConfig from './config/modal.config'

import usePageContent from '@/hooks/usePageContent'
import usePageModal from '@/hooks/usePageModal'
/* setup相同的逻辑的抽取：hooks */
// 点击search,content的操作
const { contentRef, handleQueryClick, handleResetClick } = usePageContent()
// 点击content,modal的操作
const { modalRef, handleNewClick, handleEditClick } = usePageModal()
// 对modalConfig进行操作
const modalConfigRef = computed(() => {
  const mainStore = useMainStore()
  const departments = mainStore.entireDepartments.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  modalConfig.formItems.forEach((item) => {
    if (item.prop === 'parentId') {
      item.options?.push(...departments)
    }
  })
  return modalConfig
})
</script>
<style scoped>
.department {
}
</style>
