/**
 * 根据窗口宽度判断是否为移动端
 */
export const isMobile = () => document.body.clientWidth < 876

/**
 * 生成范围内随机整数
 */
export const random = (a, b) => parseInt(Math.random() * (b - a + 1) + a, 10)

/**
 * Fisher–Yates Shuffle 洗牌算法
 */
export const shuffle = (array) => {
  let m = array.length
  let i
  while (m) {
    i = Math.floor(Math.random() * m--)
    ;[array[m], array[i]] = [array[i], array[m]]
  }
  return array
}

/**
 * url 转换
 */
export const getLocation = (href) => {
  const a = document.createElement('a')
  a.href = href
  return a
}

/**
 * 日期转换
 */
export const parseTime = (time, format = '{y}-{m}-{d} {h}:{i}:{s}') => {
  const date = new Date(time)
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 图片地址转换：raw.githubusercontent.com → fastly.jsdelivr.net
 * raw 域名国内访问仅 ~10KB/s（封面/文章图基本加载不出来），
 * jsDelivr CDN 实测快 30 倍以上；单文件 ≤20MB（图片远小于该值）。
 * Cover 组件与 MarkDown 渲染器统一经过此处，是全站图片的单一改写点。
 */
export const fileCDN = (url) => {
  if (typeof url !== 'string') return url
  return url.replace(
    /^https:\/\/raw\.githubusercontent\.com\/([^/\s]+)\/([^/\s]+)\/main\//,
    'https://fastly.jsdelivr.net/gh/$1/$2@main/'
  )
}

/**
 * 图片尺寸处理
 */
export const handleImg = (href) => {
  const urlParams = new URLSearchParams(href.split('?')[1])
  const vw = urlParams.get('vw')
  const vh = urlParams.get('vh')
  const clientWidth = document.querySelector('main').clientWidth

  // 是否预设尺寸
  let style = ''
  let width = vw
  let height = vh
  let isFull = false
  if (width) {
    if (width > clientWidth) {
      width = clientWidth
      isFull = true
    }
    style += `width: ${width}px;`

    // 在设置宽度的情况下判断高度
    if (height) {
      height = (height * width) / vw
      style += `height: ${height}px;`
    }
  }
  return { style, isFull }
}
