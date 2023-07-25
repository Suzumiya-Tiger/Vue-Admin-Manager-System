<template>
  <div class="menu">
    <pageContent
      ref="contentRef"
      :content-config="contentConfig"
      @newBtnClick="handleNewClick"
      @edit-btn-click="handleEditClick"
    ></pageContent>
    <page-modal
      ref="modalRef"
      :modal-config="modalConfigRef"
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
    ></page-modal>
  </div>
</template>

<script setup lang="ts" name="menu">
import { ref, computed } from 'vue'

import useSystemStore from '@/store/main/system/system'

import pageContent from '@/components/page-content/page-content.vue'
import contentConfig from './config/content.config'
import usePageModal from '@/hooks/usePageModal'
import usePageContent from '@/hooks/usePageContent'
import pageModal from '@/components/page-modal/page-modal.vue'
import modalConfig from './config/modal.config'
const { modalRef, handleNewClick, handleEditClick } = usePageModal()
const { contentRef, handleQueryClick } = usePageContent()

// 从pinia中获取modal内部的option的数据来源
const modalConfigRef = computed(() => {
  const mainStore = useSystemStore()
  const menuList = mainStore.pageList.map((item) => {
    return {
      label: item.name,
      value: item.sort,
      type: item.type
    }
  })
  modalConfig.formItems.forEach((item) => {
    if (item.prop === 'sort') {
      item.options = []
      item.options?.push(...menuList)
    }
  })
  return modalConfig
})
</script>
<style scoped>
.menu {
}
</style>
