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
      :modal-config="modalConfigRef"
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
    ></page-modal>
  </div>
</template>

<script setup lang="ts" name="department">
import { ref, computed } from 'vue'
// 导入功能组件
import PageSearch from '@/components/page-search/page-search.vue'
import PageContent from '@/components/page-content/page-content.vue'
import PageModal from '@/components/page-modal/page-modal.vue'

// 导入通用数据的配置
import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
import modalConfig from './config/modal.config'
import useMainStore from '@/store/main/main'

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
