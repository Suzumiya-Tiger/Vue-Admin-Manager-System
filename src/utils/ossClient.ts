import COS from 'cos-js-sdk-v5'
import hyRequest from '@/service'
import { IMG_URL } from '@/constants'

let cosClient: COS | null = null

const imgPath = '#'
export const endpoint = IMG_URL + '/'

export const initCos = async (): Promise<COS> => {
  if (cosClient) return cosClient

  const {
    data: { info }
  } = await hyRequest.get({ url: `${imgPath}/sts` })

  cosClient = new COS({
    SecretId: info.accessKeyId,
    SecretKey: info.accessKeySecret,
    XCosSecurityToken: info.securityToken,

    getAuthorization: async function (options, callback) {
      const {
        data: { info }
      } = await hyRequest.get({ url: `${imgPath}/sts` })

      callback({
        TmpSecretId: info.accessKeyId,
        TmpSecretKey: info.accessKeySecret,
        XCosSecurityToken: info.securityToken,
        ExpiredTime: info.expiredTime,
        StartTime: Math.round(Date.now() / 1000) // 添加当前时间戳作为StartTime
      })
    }
  })

  return cosClient
}
