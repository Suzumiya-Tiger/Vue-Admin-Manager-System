import { ref } from 'vue'
/*
import type PageModal from '@/components/page-modal/page-modal.vue'
这行代码的意思是：
允许你将 Vue 组件作为一个类型导入，
以便在其他地方使用该组件的类型信息进行类型检查和推断。
这在使用 Vue 3 和 TypeScript 时是一种非常方便的类型导入方式。
*/

type EditFnType = (data: any, type: string) => void

import type PageModal from '@/components/page-modal/page-modal.vue'
function usePageModal(editCB?: EditFnType) {
  const modalRef = ref<InstanceType<typeof PageModal>>()
  async function handleNewClick() {
    if (editCB) {
      await editCB(null, 'new')
    }
    modalRef.value?.setModalVisible()
  }
  async function handleEditClick(rowData: any) {
    // 如果存在回调函数，就执行回调函数
    if (editCB) {
      await editCB(rowData, 'edit')
    }
    modalRef.value?.setModalVisible(rowData)
  }
  // 以元祖的形式返回
  return { modalRef, handleNewClick, handleEditClick }
}
export default usePageModal
