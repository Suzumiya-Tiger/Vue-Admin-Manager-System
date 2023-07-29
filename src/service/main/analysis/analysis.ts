import hyRequest from '@/service'

export function getGoodsAmountListData() {
  return hyRequest.get({
    url: '/goods/amount/list'
  })
}
