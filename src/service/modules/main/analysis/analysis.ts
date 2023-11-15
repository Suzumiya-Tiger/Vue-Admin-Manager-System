import hyRequest from '@/service'

export function getGoodsAmountListData() {
  return hyRequest.get({
    url: '/goods/amount/list'
  })
}

export function getGoodsCategoryCount() {
  return hyRequest.get({
    url: '/goods/category/count'
  })
}
export function getGoodsCategorySale() {
  return hyRequest.get({
    url: '/goods/category/sale'
  })
}
export function getGoodsCategoryCollect() {
  return hyRequest.get({
    url: '/goods/category/favor'
  })
}
export function getGoodsAddressSale() {
  return hyRequest.get({
    url: '/goods/address/sale'
  })
}
