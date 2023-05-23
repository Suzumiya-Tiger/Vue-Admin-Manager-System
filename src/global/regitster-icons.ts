import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 一个调用app.use的函数
function registerIcons(app: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
export default registerIcons
