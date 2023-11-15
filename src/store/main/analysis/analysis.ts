import {
  getGoodsAmountListData,
  getGoodsCategoryCount,
  getGoodsCategorySale,
  getGoodsCategoryCollect,
  getGoodsAddressSale
} from '@/service/modules/main/analysis/analysis'
import { defineStore } from 'pinia'
interface IAnalysisState {
  amountList: any[]
  goodsCategoryCount: any[]
  goodsCategorySale: any[]
  goodsCategoryFavor: any[]
  goodsAddressSale: any[]
}
const analysisStore = defineStore('analysis', {
  state: (): IAnalysisState => ({
    amountList: [],
    goodsCategoryCount: [],
    goodsCategorySale: [],
    goodsCategoryFavor: [],
    goodsAddressSale: []
  }),
  actions: {
    async fetchAnalysisDataAction() {
      const amountResult = await getGoodsAmountListData()
      this.amountList = [...amountResult.data]
      const categoryResult = await getGoodsCategoryCount()
      this.goodsCategoryCount = [...categoryResult.data]
      const saleResult = await getGoodsCategorySale()
      this.goodsCategorySale = [...saleResult.data]
      const favorResult = await getGoodsCategoryCollect()
      this.goodsCategoryFavor = [...favorResult.data]
      const addressSaleResult = await getGoodsAddressSale()
      this.goodsAddressSale = [...addressSaleResult.data]
    }
  }
})

export default analysisStore
