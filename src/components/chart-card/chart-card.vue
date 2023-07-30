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

const props = withDefaults(defineProps<IProps>(), {
  header: '卡片头部标题'
})
</script>

<style lang="less" scoped>
.chart-card {
}
</style>
