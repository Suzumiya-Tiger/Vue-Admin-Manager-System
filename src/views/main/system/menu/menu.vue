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
      :modal-config="modalConfig"
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
    >
      <template #parentMenu>
        <div v-if="checkMenuAllow">
          <el-tree-select
            placeholder="请选择上级部门"
            v-model="menuValue.parentId"
            :data="menuOptions"
            node-key="id"
            check-strictly
            :render-after-expand="false"
            show-checkbox
            filterable
            :props="{ label: 'name', disabled: 'disabled' }"
            @check="handleElTreeCheck"
          />
          <el-divider />
        </div>
        <div v-else>
          <span></span>
        </div>
      </template>
    </page-modal>
  </div>
</template>

<script setup lang="ts" name="menu">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSystemStore from '@/store/main/system'
import useLoginStore from '@/store/login'

import pageContent from '@/components/page-content/page-content.vue'
import contentConfig from './config/content.config'
import usePageModal from '@/hooks/usePageModal'
import usePageContent from '@/hooks/usePageContent'
import pageModal from '@/components/page-modal/page-modal.vue'
import modalConfig from './config/modal.config'

import type { menuType } from '@/types/system/menu'
const { modalRef, handleNewClick, handleEditClick } = usePageModal(editCallBack)
const { contentRef } = usePageContent()
const menuValue = ref({
  id: 0,
  name: '',
  parentId: 0,
  url: '',
  type: 0,
  icon: '',
  createAt: '',
  updateAt: '',
  children: [],
  disabled: false
})
let menuOptions = ref<menuType[]>([])
function handleQueryClick(queryInfo: any) {
  contentRef.value?.fetchPageListData(queryInfo)
  const loginStore = useLoginStore()
  loginStore.loadLocalCacheAction()
}
// 从pinia中获取modal内部的option的数据来源
const { pageList } = storeToRefs(useSystemStore())
/* handleElTreeCheck 函数的参数 data 是从 el-tree-select 组件的 check 事件传递过来的。
这个 data 参数并不是一个响应式引用，
而是一个普通的 JavaScript 对象，所以你应该直接使用 data 而不是 data.value。 */
const handleElTreeCheck = (data: menuType) => {
  if (data && data.id) {
    menuValue.value.parentId = data.id
    modalConfig.propSlotValue = data.id
  }
}
const checkMenuAllow = computed(() => {
  return menuValue.value.type !== 3 && menuValue.value.type !== 1
})

watch(pageList, (newVal: menuType[]) => {
  menuOptions.value = newVal
})

function editCallBack(rowData: any, type: string) {
  if (type === 'edit') {
    menuValue.value = Object.assign({}, rowData)
  } else {
    menuValue.value = {
      id: 0,
      name: '',
      parentId: 0,
      url: '',
      type: 0,
      icon: '',
      createAt: '',
      updateAt: '',
      children: [],
      disabled: false
    }
    modalConfig.propSlotValue = 0
  }
}
</script>
