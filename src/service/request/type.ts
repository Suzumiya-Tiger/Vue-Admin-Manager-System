import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/* 针对AxiosRequestConfig配置进行扩展 */
// 通过定义可选属性
export interface HYInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
}
// AxiosRequestConfig是标准的axios实例构造函数中的传参指定类型
export interface HYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HYInterceptors<T>
}
