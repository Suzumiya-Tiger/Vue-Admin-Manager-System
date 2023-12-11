import hyRequest from '@/service'

export function getchargingPile() {
  return hyRequest.post({
    url: '/charging/piles/list'
  })
}

export function getProcessMonitoring() {
  return hyRequest.post({
    url: '/charging/processMonitoring/list'
  })
}
export function getDataAnalysis() {
  return hyRequest.post({
    url: '/charging/dataAnalysis/list'
  })
}
export function getChargingTop4() {
  return hyRequest.post({
    url: '/charging/stationTop4/list'
  })
}
export function getChargingStatistics() {
  return hyRequest.post({
    url: '/charging/statistics/list'
  })
}
export function getExceptionMonitoring() {
  return hyRequest.post({
    url: '/charging/exceptionMonitoring/list'
  })
}
