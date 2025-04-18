import { ref } from 'vue'
import { initCos, endpoint } from './ossClient'
import dayjs from 'dayjs'

export const useUpload = () => {
  const fileList = ref<any[]>([])
  const listObj = ref<
    Record<string, { hasSuccess: boolean; uid: string; url?: string }>
  >({})
  const isUploading = ref(false)

  const upload = async (option: any) => {
    try {
      isUploading.value = true

      const cosClient = await initCos()
      const { name, uid } = option.file
      const date = dayjs(uid).format('YYYY/M/D')
      const fileName = `yuegui/${date}/${uid}_${name}`

      cosClient
        .multipartUpload(fileName, option.file, {
          progress: (p: number) => {
            option.onProgress({ percent: p * 100 })
          }
        })
        .then((result: { res: unknown; name: any }) => {
          const res = result.res as unknown as { statusCode: number } // 先转换为 unknown，再断言具体类型

          if (res.statusCode === 200) {
            const url = `${endpoint}${result.name}` // 返回字符串 URL

            option.onSuccess(url, option.file)
          }
        })
        .catch((err: any) => {
          console.error(err)
          option.onError('上传失败')
        })
        .finally(() => {
          isUploading.value = false
        })
    } catch (error) {
      isUploading.value = false
      throw error
    }
  }

  return {
    fileList,
    listObj,
    upload,
    isUploading
  }
}
