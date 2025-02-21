<template>
  <div class="role">
    <page-search
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    />

    <page-content
      :content-config="contentConfig"
      ref="contentRef"
      @new-btn-click="handleNewClick"
      @check-btn-click="handleCheckClick"
    />

    <page-modal
      ref="modalRef"
      :modal-config="modalConfig"
      :content-config="contentConfig"
      :form-data="formData"
      @update="handleModalUpdate"
      @dialog-close="handleModalClose"
    >
      <!-- 自定义插槽组件 -->
      <template #menuList>
        <el-tree-select
          ref="treeRef"
          multiple
          :render-after-expand="false"
          show-checkbox
          node-key="id"
          :props="{ label: 'name' }"
          v-model="menuValue"
          :data="entireMenus"
          filterable
          @check="handleElTreeCheck"
        />
        <el-divider />
      </template>
    </page-modal>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, computed, reactive } from 'vue'
import PageSearch from '@/components/page-search/page-search.vue'
import PageContent from '@/components/page-content/page-content.vue'
import PageModal from '@/components/page-modal/page-modal.vue'
import { ElTreeSelect } from 'element-plus'

import searchConfig from './config/search.config'
import getContentConfig from './config/content.config'
import modalConfig from './config/modal.config'

import usePageContent from '@/hooks/usePageContent'
import useMainStore from '@/store/main/main'
import useSystemStore from '@/store/main/system'
import useLoginStore from '@/store/login'
import { storeToRefs } from 'pinia'
import { mapMenuListToIds } from '@/utils/map-menus'

import { getRoleById } from '@/service/modules/main/system/role'
// 页面相关的 hooks
const { contentRef, handleQueryClick, handleResetClick } = usePageContent()

// 树形选择相关
const menuValue = ref<number[]>([])
const treeRef = ref<InstanceType<typeof ElTreeSelect>>()
const mainStore = useMainStore()
const { entireMenus } = storeToRefs(mainStore)
console.log('entireMenus', entireMenus.value)

// Modal 相关
const modalRef = ref()
const systemStore = useSystemStore()
const loginStore = useLoginStore()

const formData: {
  intro: string
  menuList: any[]
  name: string
} = reactive({
  intro: '',
  menuList: [],
  name: ''
})

// 使用 computed 动态计算 contentConfig
const contentConfig = computed(() => {
  const userRole = loginStore.userInfo?.roleList?.[0] || ''
  return getContentConfig(userRole)
})

// 处理新建点击
const handleNewClick = () => {
  nextTick(() => {
    // 清空树状图数据
    treeRef.value?.setCheckedKeys([])
    menuValue.value = []
    modalConfig.propSlotData = []
  })
  modalRef.value?.setModalVisible([], 'new')
}

// 处理编辑点击
const handleCheckClick = async (itemData: any) => {
  console.log('itemData', itemData)
  const result = await getRoleById(itemData.id)
  const { data } = result

  Object.assign(formData, data)
  nextTick(() => {
    const menuIds = mapMenuListToIds(itemData.menuList ?? [])
    console.log('menuIds', menuIds)

    treeRef.value?.setCheckedKeys([...menuIds])
    menuValue.value = [...menuIds]
    formData.menuList = [...menuIds]
    modalConfig.propSlotData = [...menuIds]
  })
  modalRef.value?.setModalVisible(formData, 'check')
}

// 处理树形选择变化
function handleElTreeCheck(data1: any, data2: any) {
  const menuList = [...data2.checkedKeys, ...data2.halfCheckedKeys]
  modalConfig.propSlotData = [...menuList]
}

// 处理模态框更新
const handleModalUpdate = async (data: any) => {
  const { type, ...submitData } = data

  // 添加菜单数据
  submitData.menuList = modalConfig.propSlotData

  let result = null
  if (type === 'edit') {
    result = await systemStore.editPageDataAction(
      modalConfig.pageName,
      submitData.id,
      submitData
    )
  } else {
    result = await systemStore.newPageDataAction(
      modalConfig.pageName,
      submitData
    )
  }

  if (result.code === 200) {
    ElMessage.success(type === 'edit' ? '修改成功' : '创建成功')
    handleQueryClick()
  } else {
    ElMessage.error(result.message || '操作失败')
  }
}

// 处理模态框关闭
const handleModalClose = () => {
  // 清空树形选择数据
  treeRef.value?.setCheckedKeys([])
  menuValue.value = []
  modalConfig.propSlotData = []
}
</script>

<style lang="less" scoped>
.role {
  display: flex;
  flex-direction: column;
}
</style>
