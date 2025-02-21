import hyRequest from '@/service'
export function getRoleById(id: number) {
  return hyRequest.get({
    url: `/role/${id}`
  })
}
