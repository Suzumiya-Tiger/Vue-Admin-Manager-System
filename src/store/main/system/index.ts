import {
  postPageListData,
  deletePageById,
  newPageData,
  editPageData
} from '@/service/modules/main/system/system'
import { defineStore } from 'pinia'
import type { ISystemState } from './type'
import { filterEmptyParams } from '@/utils/filter-param'
const useSystemStore = defineStore('system', {
  state: (): ISystemState => ({
    pageList: [],
    pageTotalCount: 0,
    // 是否初次加载，如果是则加载fetchEntireDataAction
    isFirstLoad: true
  }),
  actions: {
    // 变更是否初次刷新页面状态
    async changeFirstLoad() {
      this.isFirstLoad = !this.isFirstLoad
    },
    /* 针对所有通用页面的数据：根据其增删改查的特性进行封装 */
    async postPageListAction(pageName: string, queryInfo: any) {
      const pageListResult = await postPageListData(
        pageName,
        filterEmptyParams(queryInfo)
      )

      const { data } = pageListResult
      this.pageList = data.list
      this.pageTotalCount = data.totalCount
    },
    async deletePageByIdAction(pageName: string, id: number) {
      const deleteResult = await deletePageById(pageName, id)
      return deleteResult
    },
    async newPageDataAction(pageName: string, pageInfo: any) {
      const newResult = await newPageData(pageName, filterEmptyParams(pageInfo))
      return newResult
    },
    async editPageDataAction(pageName: string, id: number, pageInfo: any) {
      const editResult = await editPageData(
        pageName,
        id,
        filterEmptyParams(pageInfo)
      )
      return editResult
    }
  }
})

export default useSystemStore
