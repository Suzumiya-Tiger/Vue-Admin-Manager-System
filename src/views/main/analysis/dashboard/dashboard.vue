<template>
  <div class="dashboard">
    <!-- 1.顶部的数字的数据展示 -->
    <el-row :gutter="10">
      <template v-for="item in amountList" :key="item">
        <el-col :span="6">
          <count-card v-bind="item"></count-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CountCard from '@/components/count-card/count-card.vue'
import useAnalysisStore from '@/store/main/analysis/analysis'
import { storeToRefs } from 'pinia'
// 1.先发起获取数据的请求
const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()
// 2.再从store中获取数据
const { amountList } = storeToRefs(analysisStore)
</script>

<style lang="less" scoped>
.dashboard {
  color: red;
}
</style>
