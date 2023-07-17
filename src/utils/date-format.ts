import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
// format通过默认值使用类型推导即可
export function formatUTC(utcString: string, format = 'YYYY-MM-DD hh:mm:ss') {
  // utcOffset(8)表示东八区，也就是北京时间
  const resultTime = dayjs.utc(utcString).utcOffset(8).format(format)
  return resultTime
}
