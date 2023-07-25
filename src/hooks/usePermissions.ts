import useLoginStore from '@/store/login/login'

export default function usePermissions(permissionID: string) {
  const loginStore = useLoginStore()
  const { permissions } = loginStore
  // !!代表转化为Boolean类型
  return !!permissions.find((item) => item.includes(permissionID))
}
