<template>
  <div class="chart-card">
    <el-card class="box-card" :header="header">
      <slot>default content</slot>
    </el-card>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  header?: string
}
</script>

<style lang="less" scoped>
.chart-card {
}
</style>
