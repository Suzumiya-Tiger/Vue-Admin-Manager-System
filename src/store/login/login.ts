import { defineStore } from 'pinia'
import { accountLoginRequest } from '@/service/login/login'

import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'
const LOGIN_TOKEN = 'login/token'
const useLoginStore = defineStore('login', {
  state: () => ({
    id: '',
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    name: ''
  }),
  actions: {
    async loginAccountAction(account: IAccount) {
      // 1.账号登录，获取token等信息
      // 网络请求应该在store中进行执行，业务页面直接调用该请求完成store参数的录入即可
      const loginResult = await accountLoginRequest(account)
      this.id = loginResult.data.id
      this.token = loginResult.data.token
      this.name = loginResult.data.name

      // 2.进行本地缓存
      // 以LOGIN_TOKEN的键名存入token
      localCache.setCache(LOGIN_TOKEN, this.token)
    }
  }
})
export default useLoginStore
