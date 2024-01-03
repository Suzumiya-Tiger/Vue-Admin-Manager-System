<template>
  <div class="user">
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
      <template #status="scope">
        <el-button
          size="small"
          plain
          :type="scope.row.enable === 1 ? 'success' : 'danger'"
        >
          {{ tranferEnable(scope.row.enable) }}</el-button
        >
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

<script setup lang="ts">
import { computed, reactive } from 'vue'

import useMainStore from '@/store/main/main'

// 1.导入组件(vueComponent)
// 2.导入数据通用配置(config)
// 3.导入交互逻辑(hooks)import PageSearch from '@/components/page-search/page-search.vue'
import PageContent from '@/components/page-content/page-content.vue'
import PageModal from '@/components/page-modal/page-modal.vue'

import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
import type { IModalConfig } from '@/components/page-modal/type'

import usePageContent from '@/hooks/usePageContent'
import usePageModal from '@/hooks/usePageModal'

// 编辑状态时隐藏密码
const hiddenPassword = (rowData: any) => {
  // 新建无需进行密码隐藏
  if (!rowData) {
    for (let i = 0; i < modalConfig.formItems.length; i++) {
      const item = modalConfig.formItems[i]
      if (item.prop === 'password') {
        item.hidden = false
        break
      }
    }
  } else {
    for (let i = 0; i < modalConfig.formItems.length; i++) {
      const item = modalConfig.formItems[i]
      if (item.prop === 'password') {
        item.hidden = true
        break
      }
    }
  }
}
// 将 modalConfig 转换为响应式对象
const modalConfig: IModalConfig = reactive({
  pageName: 'users',
  header: {
    newTitle: '新建用户',
    editTitle: '编辑用户'
  },
  formItems: [
    {
      type: 'input',
      label: '用户名',
      prop: 'name',
      placeholder: '请输入用户名',
      required: true,
      initialValue: ''
    },
    {
      type: 'input',
      label: '真实姓名',
      prop: 'realname',
      placeholder: '请输入真实姓名',
      required: false,
      initialValue: ''
    },
    {
      type: 'input',
      label: '登录密码',
      prop: 'password',
      hidden: false,
      placeholder: '请输入登录密码',
      required: true,
      initialValue: ''
    },
    {
      type: 'input',
      label: '手机号码',
      prop: 'cellphone',
      placeholder: '请输入手机号码',
      required: false,
      initialValue: ''
    },
    {
      type: 'select',
      prop: 'role_id',
      label: '选择角色',
      placeholder: '请选择角色',
      initialValue: null,
      options: [],
      required: true
    },
    {
      type: 'select',
      prop: 'departmentId',
      label: '选择部门',
      placeholder: '请选择部门',
      initialValue: null,
      options: [],
      required: false
    }
  ]
})
/* 利用setup封装重复方法：利用hooks来把重复的逻辑方法抽取封装，然后解构导入 */
// 其实本质上类似于vue2的mixins，下面是点击search,content的操作
const { contentRef, handleQueryClick, handleResetClick } = usePageContent()
// 点击content,modal的操作
const { modalRef, handleNewClick, handleEditClick } =
  usePageModal(hiddenPassword)
const tranferEnable = computed(() => {
  // 3.对usersList的数据进行处理，转换成表格需要的数据格式
  return (enable: number) => {
    return enable === 1 ? '启用' : '禁用'
  }
})

// 对modalConfig进行操作
const modalConfigRef = computed(() => {
  const mainStore = useMainStore()
  // 要对需要导入的options数据进行符合el-select的格式的转换
  const roleOptions = mainStore.entireRoles.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  const departmentOptions = mainStore.entireDepartments.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  modalConfig.formItems.forEach((item) => {
    // 针对select-options组件进行options数据的数据导入
    if (item.prop === 'role_id') {
      item.options = [...roleOptions]
    } else if (item.prop === 'departmentId') {
      item.options = [...departmentOptions]
    }
  })
  return modalConfig
})
</script>
