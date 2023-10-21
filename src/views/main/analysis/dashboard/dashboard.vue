<template>
  <div class="dashboard">
    <!-- 1.顶部的数字的数据展示 -->
    <el-row :gutter="10">
      <template v-for="item in amountList" :key="item">
        <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
          <count-card v-bind="item"></count-card>
        </el-col>
      </template>
    </el-row>
    <!-- 中间内容的图表 -->
    <el-row :gutter="5">
      <el-col :span="7">
        <chart-card header="商品销量总揽">
          <PieEchart :pieData="showGoodsCategoryCount" />
        </chart-card>
      </el-col>
      <el-col :span="10">
        <chart-card header="全国总销量"
          ><MapEchart :mapData="showGoodsAddressSale" />
        </chart-card>
      </el-col>
      <el-col :span="7">
        <chart-card header="商品销量比例"
          ><RoseEchart :roseData="showGoodsCategoryCount"
        /></chart-card>
      </el-col>
    </el-row>
    <!-- 底部的图表 -->
    <el-row :gutter="10">
      <el-col :span="12">
        <chart-card header="商品收藏量">
          <LineEchart v-bind="showRoseCategoryFavor"
        /></chart-card>
      </el-col>
      <el-col :span="12">
        <chart-card header="分类商品销量">
          <BarEchart v-bind="showRoseCategorySale" />
        </chart-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CountCard from '@/components/count-card/count-card.vue'
import ChartCard from '@/components/chart-card/chart-card.vue'
import useAnalysisStore from '@/store/main/analysis/analysis'
import { storeToRefs } from 'pinia'
import {
  PieEchart,
  LineEchart,
  RoseEchart,
  BarEchart,
  MapEchart
} from '@/components/page-echart'
import { computed } from 'vue'
// 1.先发起获取数据的请求
const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()
// 2.再从store中获取数据
const {
  amountList,
  goodsCategoryCount,
  goodsCategorySale,
  goodsCategoryFavor,
  goodsAddressSale
} = storeToRefs(analysisStore)

// 3.为echart组件提供数据
const showGoodsCategoryCount = computed(() => {
  return goodsCategoryCount.value.map((item) => {
    return {
      name: item.name,
      value: item.count
    }
  })
})
const showRoseCategorySale = computed(() => {
  const labels: string[] = []
  const values: any[] = []
  for (const item of goodsCategorySale.value) {
    labels.push(item.name)
    values.push(item.goodsCount)
  }
  return {
    labels,
    values
  }
})
const showRoseCategoryFavor = computed(() => {
  const labels: string[] = []
  const values: any[] = []
  for (const item of goodsCategoryFavor.value) {
    labels.push(item.name)
    values.push(item.goodsFavor)
  }
  return {
    labels,
    values
  }
})

const showGoodsAddressSale = computed(() => {
  return goodsAddressSale.value.map((item) => {
    return {
      name: item.address,
      value: item.count
    }
  })
})
</script>

<style lang="less" scoped>
.dashboard {
  background-color: #f5f5f5;
  .el-row {
    margin-top: 20px;
  }
}
</style>
