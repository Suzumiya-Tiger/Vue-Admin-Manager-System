import { getGoodsAmountListData } from '@/service/main/analysis/analysis'
import { defineStore } from 'pinia'
interface IAnalysisState {
  amountList: any[]
}
const analysisStore = defineStore('analysis', {
  state: (): IAnalysisState => ({
    amountList: []
  }),
  actions: {
    async fetchAnalysisDataAction() {
      const amountResult = await getGoodsAmountListData()
      this.amountList = [...amountResult.data]
    }
  }
})

export default analysisStore
