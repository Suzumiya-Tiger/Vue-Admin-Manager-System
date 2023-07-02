// 定义枚举类型
enum CacheType {
  Local,
  Session
}
// Cache暴露给了pinia的login模块
class Cache {
  storage: Storage
  constructor(type: CacheType) {
    // 传入的type是枚举类型的其中一个属性，这里需要对type进行鉴别，获取对应的存储方式
    this.storage = type === localStorage.Local ? localStorage : sessionStorage
  }
  setCache(key: string, value: any) {
    if (value) {
      // 记得获取的数据要进行JSON.stringify()转换操作，录入到setItem第二个参数即可完成操作
      this.storage.setItem(key, JSON.stringify(value))
    }
  }
  getCache(key: string) {
    const value = this.storage.getItem(key)
    if (value) {
      // 记得获取的数据要进行JSON.parse()转换操作
      return JSON.parse(value)
    }
  }
  removeCache(key: string) {
    this.storage.removeItem(key)
  }
  clear() {
    this.storage.clear()
  }
}
// 在生成对象实例的时候传入枚举类型具体的值
// 以后直接调用该对象实例内部的方法即可完成对应的数据操作方式
const localCache = new Cache(CacheType.Local)
const sessionCache = new Cache(CacheType.Session)
// 输出对应的
export { localCache, sessionCache }
