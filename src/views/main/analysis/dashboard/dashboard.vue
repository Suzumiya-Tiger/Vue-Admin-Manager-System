<template>
  <main class="screen-bg">
    <div class="header"></div>

    <div class="main-container">
      <div class="left-container">
        <div class="left-top">
          <pie-charts
            :pieDatas="pieEchartData"
            width="100%"
            height="100%"
          ></pie-charts>
        </div>
        <div class="left-bottom">
          <line-echarts
            :lineData="lineEchartData"
            width="100%"
            height="100%"
          ></line-echarts>
        </div>
      </div>

      <div class="center-container">
        <div class="center">
          <center-svg></center-svg>
        </div>
        <div class="bottom">
          <bottom-panel
            :panelItems="analysisData"
            width="100%"
            height="100%"
          ></bottom-panel>
        </div>
      </div>

      <div class="right-container">
        <div class="right-top">
          <right-top-panel
            :panelItems="topPercentageData"
            :percentage="totalPercentageData"
          ></right-top-panel>
        </div>
        <div class="right-center">
          <bar-echarts
            :barData="barEchartData"
            width="100%"
            height="100%"
          ></bar-echarts>
        </div>
        <div class="right-bottom">
          <right-bottom-svg
            width="100%"
            height="100%"
            :dots="exceptionMonitoringData"
          ></right-bottom-svg>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useAnalysisStore from '@/store/main/analysis/analysis'
import { storeToRefs } from 'pinia'

import pieCharts from './components/pie-echarts.vue'
import lineEcharts from './components/line-echarts.vue'
import barEcharts from './components/bar-echarts.vue'
// 水球
import rightTopPanel from './components/right-top-panel.vue'
// 右边底部svg
import rightBottomSvg from './components/right-bottom-svg.vue'
import centerSvg from './components/center-svg.vue'
import bottomPanel from './components/bottom-panel.vue'

// 1.先发起获取数据的请求
const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()
// 2.再从store中获取数据
const {
  pieEchartData,
  lineEchartData,
  barEchartData,
  exceptionMonitoringData,
  analysisData,
  topPercentageData,
  totalPercentageData
} = storeToRefs(analysisStore)
</script>
<style lang="less" scoped>
:global(.el-main) {
  --el-main-padding: 0 !important;
}
.screen-bg {
  position: relative;
  height: 100%;
  /* 背景 */
  background-image: url(@/assets/images/bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .header {
    // 定位
    height: 0.1875rem;
    padding-top: 0.0521rem;
    // 背景
    background-image: url(@/assets/images/bg_header.svg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position-y: 10px;
  }
  .main-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: nowrap;
    .left-container {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding-top: 0;
      height: 100%;
      .left-top {
        /* 定位 */
        width: 2.375rem;
        height: 2.0833rem;

        /* 背景 */
        background-image: url(@/assets/images/bg_left-top.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .left-bottom {
        width: 2.375rem;
        height: 2.0938rem;
        margin-top: 10px;
        /* 背景 */
        background-image: url(@/assets/images/bg_left_bottom.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    .right-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: nowrap;
      margin-top: 5px;
      height: 100%;
      .right-top {
        width: 2.4219rem;
        height: 1.5rem;
        background-image: url(@/assets/images/bg_right_top.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .right-center {
        width: 2.4219rem;
        height: 1.5469rem;

        background-image: url(@/assets/images/bg_right_center.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .right-bottom {
        width: 2.4219rem;
        height: 1.1042rem;
        background-image: url(@/assets/images/bg_right_bottom.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
      }
    }

    .center-container {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex-wrap: nowrap;
      .center {
        width: 3.2448rem;
        height: 3.1771rem;
      }

      .bottom {
        width: 3.401rem;
        height: 0.776rem;

        background-image: url(@/assets/images/bg_bottom.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
