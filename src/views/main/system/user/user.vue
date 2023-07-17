<template>
  <div class="user">
    <user-search
      @resetClick="handleResetClick"
      @query-click="handleQueryClick"
    />
    <user-content
      ref="contentRef"
      @new-btn-click="handleNewBtnClick"
      @edit-btn-click="handleEditClick"
    />
    <user-modal
      ref="modalRef"
      @create-btn-click="handleResetClick"
      @edit-btn-click="handleResetClick"
    />
  </div>
</template>

<script setup lang="ts">
import UserSearch from './c-cpns/user-search.vue'
import UserContent from './c-cpns/user-content.vue'
import UserModal from './c-cpns/user-modal.vue'
import { ref } from 'vue'

// 对content组件进行操作
// 将该组件被暴露出去的fetchUserListData函数在父组件中进行调用
const contentRef = ref<InstanceType<typeof UserContent>>()
// 从user-search表单中发射过来的queryClick事件是带有formData表单数据的
// 结合被暴露出来fetchUserListData进行调用，使得我们可以在父组件中使得子组件的fetchUserListData
// 函数进行调用，从而实现父组件对子组件的操作
function handleQueryClick(formData: any) {
  contentRef.value?.fetchUserListData(formData)
}
function handleResetClick() {
  contentRef.value?.fetchUserListData()
}
// 利用兄弟组件->父组件的事件传递，对Modal组件进行操作
const modalRef = ref<InstanceType<typeof UserModal>>()
function handleNewBtnClick() {
  modalRef.value?.setModalVisible()
}
function handleEditClick(row: any) {
  modalRef.value?.setModalVisible(row)
}
</script>

<style lang="less" scoped></style>
