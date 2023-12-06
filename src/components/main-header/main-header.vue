<template>
  <div class="main-header">
    <div class="menu-icon" @click="handleFoldClick">
      <el-icon size="24px">
        <component :is="isFold ? 'Expand' : 'Fold'"> </component>
      </el-icon>
    </div>
    <div class="content">
      <header-crumb />
      <header-info />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import HeaderCrumb from './c-cpns/header-crumb.vue'
import HeaderInfo from './c-cpns/header-info.vue'
// 0 内部自定义事件
const emit = defineEmits(['foldChange'])
const isFold = shallowRef(false)
function handleFoldClick() {
  // 1.内部改变状态
  isFold.value = !isFold.value
  // 2.将事件和状态传递给父组件(自定义事件)
  emit('foldChange', isFold.value)
}
</script>

<style lang="less" scoped>
.main-header {
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;

  .menu-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 18px;
  }
}
</style>
