<template>
  <div class="role">
    <page-search :search-config="searchConfig"></page-search>
  </div>
</template>

<script setup lang="ts">
import pageSearch from '@/components/page-search/page-search.vue'
import searchConfig from './config/search.config'
</script>

<style lang="less" scoped>
.role {
}
</style>
