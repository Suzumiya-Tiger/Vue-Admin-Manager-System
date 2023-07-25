import { toRaw, reactive } from 'vue'

// 深拷贝 reactive 对象
export default function deepCopyReactive(reactiveObj: any) {
  // 先将 reactive 对象转换为普通对象
  const rawObj = toRaw(reactiveObj)

  // 使用 JSON.stringify 和 JSON.parse 进行深拷贝
  const copiedObj = JSON.parse(JSON.stringify(rawObj))

  // 将普通对象转换回 reactive 对象
  const copiedReactiveObj = reactive(copiedObj)

  return copiedReactiveObj
}
