export type analysisOption = analysisData[]
interface analysisData {
  id: number
  isUp: boolean
  percentage: number
  title: string
  unit: string
  totalNum: number
}
