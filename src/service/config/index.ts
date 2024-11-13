// 1.区分开发环境和生产环境
// 代码逻辑判断：判断当前的环境决定BASE_URL
// vite的环境变量放在import.meta上面了，webpack则是放在process上面

// vite默认提供的环境变量↓
// console.log(import.meta.env.MODE)
// // 直接判断是否是开发环境/生产环境
// console.log(import.meta.env.DEV)
// console.log(import.meta.env.PROD)
// // 是否是SSR(服务器端渲染)
// console.log(import.meta.env.SSR)

let BASE_URL = ''
if (import.meta.env.PROD) {
  // 生产环境
  BASE_URL = 'http://139.199.212.233:8082'
} else {
  // 开发环境
  BASE_URL = 'http://139.199.212.233:8082'
}

// 3.通过创建.env(dotenv)文件来直接创建变量
// console.log(import.meta.env);
// 自定义env变量
// console.log(import.meta.env.VITE_URL)
export const TIME_OUT = 8000
export { BASE_URL }
