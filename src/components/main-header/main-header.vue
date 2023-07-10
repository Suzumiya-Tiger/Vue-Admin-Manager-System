<template>
  <div class="main-header">
    <div class="menu-icon">
      <el-icon size="22">
        <Fold />
      </el-icon>
    </div>
    <div class="content">
      <div class="breadcrumb"></div>
      <div class="info"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

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