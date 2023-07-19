<template>
  <div class="department">
    <page-search
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleQueryClick"
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
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
    ></page-modal>
  </div>
</template>

<script setup lang="ts" name="department">
import { ref } from 'vue'
import PageSearch from '@/components/page-search/page-search.vue'
import PageContent from '@/components/page-content/page-content.vue'
import PageModal from './c-cpns/page-modal.vue'

import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
// 点击search,content的操作
const contentRef = ref<InstanceType<typeof PageContent>>()
function handleQueryClick(queryInfo: any) {
  contentRef.value?.fetchPageListData(queryInfo)
}

const modalRef = ref<InstanceType<typeof PageModal>>()
function handleNewClick() {
  modalRef.value?.setModalVisible()
}
function handleEditClick(rowData: any) {
  modalRef.value?.setModalVisible(rowData)
}
</script>
<style scoped>
.department {
}
</style>
