<template>
  <div class="role">
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
    ></page-content>
    <page-modal
      ref="modalRef"
      :modal-config="modalConfig"
      @create-btn-click="handleQueryClick"
      @edit-btn-click="handleQueryClick"
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
import { nextTick, ref } from 'vue'
// 1.导入组件(vueComponent)
// 2.导入数据通用配置(config)
// 3.导入交互逻辑(hooks)
import pageSearch from '@/components/page-search/page-search.vue'
import searchConfig from './config/search.config'

import PageContent from '@/components/page-content/page-content.vue'
import contentConfig from './config/content.config'

import pageModal from '@/components/page-modal/page-modal.vue'
import modalConfig from './config/modal.config'

import usePageContent from '@/hooks/usePageContent'
import usePageModal from '@/hooks/usePageModal'
import useMainStore from '@/store/main/main'
import { storeToRefs } from 'pinia'
import { ElTreeSelect } from 'element-plus'

import { mapMenuListToIds } from '@/utils/map-menus'
const { contentRef, handleQueryClick, handleResetClick } = usePageContent()
// editCallBack是一个回调函数,用于在点击编辑按钮时,将数据回显到表单中
const { modalRef, handleNewClick, handleEditClick } = usePageModal(editCallBack)

// 获取完整的菜单
const menuValue = ref<number[]>([])
const mainStore = useMainStore()
const otherInfo = ref({})
const { entireMenus } = storeToRefs(mainStore)
function handleElTreeCheck(data1: any, data2: any) {
  // 将父项和被选中的子项的id拼接成一个数组
  const menuList = [...data2.checkedKeys, ...data2.halfCheckedKeys]
  otherInfo.value = { menuList }
  // 将otherInfo的值赋值给modalConfig.otherInfo
  modalConfig.otherInfo = otherInfo.value
}
// 获取树形组件的ref,完成树形组件的数据回显
const treeRef = ref<InstanceType<typeof ElTreeSelect>>()
function editCallBack(itemData: any, type: string) {
  /*    树形组件是在role.vue中定义的,所以需要在role.vue中获取树形组件的ref
   editCallBack之所以在role.vue中定义,在usePageModal中执行，
   是需要通过handleEditClick的调用，进而在Modal组件的hooks中执行editCallBack,
   简而言之，也就是在editCallBack这一层的role.vue去执行树形组件的方法，完成父组件和子组件的中介通信
   role.vue不能替代PageModal组件的hooks执行editCallBack */

  // 通过树形组件的ref,调用树形组件的方法,将数据回显到树形组件中
  // 新建情况下需要清空树状数据
  if (type === 'edit') {
    nextTick(() => {
      const menuIds = mapMenuListToIds(itemData.menuList)
      treeRef.value?.setCheckedKeys([...menuIds])
      menuValue.value = [...menuIds]
    })
  } else {
    nextTick(() => {
      modalConfig.otherInfo = []
      treeRef.value?.setCheckedKeys([])
      menuValue.value = []
    })
  }
}
</script>

<style lang="less" scoped>
.role {
}
</style>
