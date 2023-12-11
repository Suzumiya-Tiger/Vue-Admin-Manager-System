import {
  getchargingPile,
  getProcessMonitoring,
  getDataAnalysis,
  getChargingTop4,
  getChargingStatistics,
  getExceptionMonitoring
} from '@/service/modules/main/analysis/analysis'
import { defineStore } from 'pinia'
import type {
  barDataOption,
  analysisOption,
  lineDataOption,
  pieData,
  IDots,
  topOption
} from '@/types/powerScreen/index'
interface IAnalysisState {
  pieEchartData: pieData
  lineEchartData: lineDataOption
  barEchartData: barDataOption
  exceptionMonitoringData: IDots
  analysisData: analysisOption
  topPercentageData: topOption
  totalPercentageData: number
}
const analysisStore = defineStore('analysis', {
  state: (): IAnalysisState => ({
    pieEchartData: [],
    lineEchartData: {
      correctData: {
        name: '',
        data: []
      },
      errorData: {
        name: '',
        data: []
      }
    },
    barEchartData: [],
    exceptionMonitoringData: [],
    analysisData: [],
    topPercentageData: [],
    totalPercentageData: 0
  }),
  actions: {
    async fetchAnalysisDataAction() {
      const pieEchartResult = await getchargingPile()
      this.pieEchartData = [...pieEchartResult.data]
      const lineEchartResult = await getProcessMonitoring()
      this.lineEchartData.errorData = lineEchartResult.data[0]
      this.lineEchartData.correctData = lineEchartResult.data[1]
      const barEchartResult = await getChargingStatistics()
      this.barEchartData = [...barEchartResult.data]
      const exceptionMonitoringResult = await getExceptionMonitoring()
      this.exceptionMonitoringData = [...exceptionMonitoringResult.data]
      const analysisResult = await getDataAnalysis()
      this.analysisData = [...analysisResult.data]
      const topPercentageResult = await getChargingTop4()
      this.topPercentageData = [...topPercentageResult.data[0].data]
      const totalPercentageResult = await getChargingStatistics()
      this.totalPercentageData = totalPercentageResult.data[0]?.totalPercentage
    }
  }
})

export default analysisStore
