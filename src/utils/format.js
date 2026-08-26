import { format } from 'timeago.js'
import { parseTime } from './index'
import config from '../config'

/**
 * 格式化文章
 * ponytail: 兼容 LF/CRLF；body 不符合 [title](url)\ndesc 约定时安全回退到默认封面 + 全文。
 *           封面 URL 命中紫粉色 hex 黑名单时自动回退（防老内容泄漏旧主题色，不影响已替换为金色的新图）。
 */
const regex = /^(.+?)\r?\n\s*(.+?)\r?\n/s
const coverRegex = /^\[(.+)\].*(https?:.*(?:jpg|jpeg|png|gif|webp|svg))/
const blacklistCoverRe = /b28fce|b854d4|cf95e8|f596aa|fbc2eb|a18cd1|a64fd0/i
export const formatPost = (post) => {
  if (!post) return post
  const { created_at } = post
  const body = String(post.body || '')
  const result = regex.exec(body)
  let cover = null
  if (result) {
    cover = coverRegex.exec(result[1])
  }
  if (cover && cover.length === 3 && !blacklistCoverRe.test(cover[2])) {
    post.cover = { title: cover[1], src: cover[2] }
    post.description = result[2]
  } else {
    post.cover = { title: '', src: config.defaultCover }
    post.description = result ? result[1] : body
  }
  post.created_at = format(created_at, 'zh_CN').replace(/\s/, '')
  return post
}

/**
 * 格式化分类
 * description 约定格式：第一行 summary:xxx，第二行 cover:xxx（缺省则兜底为空）
 */
export const formatCategory = (category) => {
  ;(category || []).forEach((o) => {
    const lines = String(o.description || '').split('\r\n')
    o.summary = String(lines[0] || '').split('summary:')[1] || ''
    o.cover = String(lines[1] || '').split('cover:')[1] || ''
  })
  return category
}

/**
 * 格式化灵感
 */
export const formatInspiration = (inspiration) => {
  inspiration.forEach((o) => (o.date = parseTime(o.created_at, '{y}年{m}月{d}日')))
  return inspiration
}

/**
 * 格式化书单 & 友链 & 关于
 */
export const formatPage = (data, type) => {
  if (!data || !data.body) return []
  let section = data.body.split('## ').filter((o) => o.length)

  switch (type) {
    case 'book':
    case 'friend':
      section = section.map((o) => {
        const content = o.split('\r\n').filter((o) => o.length)
        const result = {}
        content.forEach((row, index) => {
          if (index === 0) {
            result.name = row
          } else {
            const inx = row.indexOf(':')
            const key = row.slice(0, inx)
            const value = row.slice(inx + 1)
            result[key] = value
          }
        })
        return result
      })
      break
    case 'about':
      section = section.map((o) => {
        const title = o.match(/.+?\r\n/)[0]
        return {
          title,
          content: o.slice(title.length),
        }
      })
      break
    default:
      break
  }
  // 移除首尾空格
  section.forEach((item) => {
    Object.keys(item).forEach((k) => {
      item[k] = item[k].trim()
    })
  })

  return section
}
