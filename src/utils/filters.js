export default {
  numTo(value) {
    const ary = [
      '零级',
      '一级',
      '二级',
      '三级',
      '四级',
      '五级',
      '六级',
      '七级',
      '八级',
      '九级',
      '十级'
    ]
    return ary[value]
  },
  dateFormat(value) {
    const dt = new Date(value)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
}
