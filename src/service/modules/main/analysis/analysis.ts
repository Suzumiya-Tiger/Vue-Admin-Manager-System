import hyRequest from '@/service'

export function getchargingPile() {
  return hyRequest.post({
    url: '/charging/piles/list'
  })
}

export function getProcessMonitoring() {
  return hyRequest.post({
    url: '/charging/processmonitoring/list'
  })
}
export function getDataAnalysis() {
  return hyRequest.post({
    url: '/charging/dataanalysis/list'
  })
}
export function getChargingTop4() {
  return hyRequest.post({
    url: '/charging/stationtop4/list'
  })
}
export function getChargingStatistics() {
  return hyRequest.post({
    url: '/charging/statistics/list'
  })
}
export function getExceptionMonitoring() {
  return hyRequest.post({
    url: '/charging/exceptionmonitoring/list'
  })
}
