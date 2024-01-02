/* 用户的网络请求 */
import hyRequest from '@/service'
/* 针对页面的网络请求：增删改查 */

// 规范化接口名称的封装调用
export function postPageListData(pageName: string, queryInfo: any) {
  return hyRequest.post({ url: `${pageName}/list`, data: queryInfo })
}
export function deletePageById(pageName: string, id: number) {
  return hyRequest.delete({
    url: `/${pageName}/${id}`
  })
}
export function newPageData(pageName: string, pageInfo: any) {
  return hyRequest.post({
    url: `/${pageName}`,
    data: pageInfo
  })
}
export function editPageData(pageName: string, id: number, pageInfo: any) {
  return hyRequest.patch({
    url: `/${pageName}/${id}`,
    data: pageInfo
  })
}
