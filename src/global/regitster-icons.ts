import type { App } from 'vue'
// 导入所有的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

function registerIcons(app: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    // 把所有图标注册成app的全局组件
    app.component(key, component)
  }
}
export default registerIcons
