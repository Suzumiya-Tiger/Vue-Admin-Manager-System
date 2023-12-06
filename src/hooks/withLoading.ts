import { ElLoading } from 'element-plus'
interface loadingType {
  lock: boolean
  text: string
  background: string
  target: HTMLElement | string
}
let defaultOptions: loadingType = {
  lock: true,
  text: '正在加载中...',
  background: 'rgba(122, 122, 122, 0.8)',
  target: document.body
}
/**
 * 传入一个方法fn,在它执行周期内,加上全屏loading
 * 如果：
 * 1. fn是同步方法，结束后隐藏loading
 * 2. 如果是异步方法，resolve后隐藏loading
 * 3. 报错后隐藏loading并抛出错误
 * 注意事项：
 * 在你的 withLoading 函数中，你需要调用 fn 函数并等待它的结果。
 * 如果 fn 是一个 Promise 对象，你将无法调用它，因为 Promise 对象没有被设计为可调用的(很重要)。
 * 因此，你应该保持 fn 的类型为 (...args: any) => Promise<any>，
 * 以便你可以传入一个函数并在 withLoading 函数中调用它。
 * @param {*} fn 函数
 * @returns Function 一个新的函数，去执行它吧
 */
export const withLoading = (
  fn: (...args: any) => Promise<any>,
  options = {}
) => {
  let loading: any
  const showLoading = (options: loadingType) => {
    // 创建一个容器元素并将其附加到 document.body 中
    const container = document.createElement('div')
    document.body.appendChild(container)
    options.target = container
    loading = ElLoading.service(options)
  }
  const hideLoading = () => {
    if (loading) {
      loading.close()
    }
  }
  const _options = Object.assign(defaultOptions, options)
  const newFn = async (...args: any[]) => {
    try {
      showLoading(_options)
      // ...args是为了将fn原本携带的参数传递下去
      const result = await fn(...args)
      const isPromise = result instanceof Promise
      if (!isPromise) {
        hideLoading()
        return result
      }
      return result
        .then((res) => {
          hideLoading()
          return res
        })
        .catch((err) => {
          hideLoading()
          throw err
        })
    } finally {
      hideLoading()
      defaultOptions = {
        lock: true,
        text: '正在加载中...',
        background: 'rgba(122, 122, 122, 0.8)',
        target: document.body
      }
    }
  }
  return newFn
}
