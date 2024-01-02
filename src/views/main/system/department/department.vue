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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSystemStore from '@/store/main/system'

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
/* 利用setup封装重复方法：利用hooks来把重复的逻辑方法抽取封装，然后解构导入 */
// 其实本质上类似于vue2的mixins，下面是点击search,content的操作
const { contentRef, handleQueryClick, handleResetClick } = usePageContent()
// 点击content,modal的操作
const { modalRef, handleNewClick, handleEditClick } = usePageModal()
/* department的modal只需要相同的list数据，故只需要导入，无需利用fetchEntireDataAction再次导入Modal选项数据 */
const systemStore = useSystemStore()
const { pageList } = storeToRefs(systemStore)

// 对modalConfig进行操作
const modalConfigRef = computed(() => {
  // 要对需要导入的options数据进行符合el-select的格式的转换
  const departments = pageList.value.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  modalConfig.formItems.forEach((item) => {
    // 针对select-options组件进行options数据的数据导入
    if (item.prop === 'parentId') {
      item.options?.push(...departments)
    }
  })
  return modalConfig
})
</script>
