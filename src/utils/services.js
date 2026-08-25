import config from '../config'

const GITHUB_API = 'https://api.github.com/repos'

const { username, repository, token } = config
const blog = `${GITHUB_API}/${username}/${repository}`
const access_token = token && token.length ? `token ${token.join('')}` : ''

// 状态检测
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) return response
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

// github fetch
const githubFetch = async (url, isQueryPage = false) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      // token 为空时不带 Authorization，回退匿名访问（限额 60/h）
      headers: access_token ? { Authorization: access_token } : {},
    })
    checkStatus(response)
    const data = await response.json()
    return isQueryPage ? data[0] : data
  } catch (error) {
    console.log(error)
  }
}

// REST 分页计数：per_page=100 一次拉取，>100 时用 Link 头 last page 推断总数
// 替代 GraphQL（匿名限额 60/h 独立且易耗尽），仅用 REST 统一限额
const githubFetchCount = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: access_token ? { Authorization: access_token } : {},
    })
    checkStatus(response)
    const link = response.headers.get('Link') || ''
    const last = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
    if (last) return parseInt(last[1], 10)
    const data = await response.json()
    return Array.isArray(data) ? data.length : 0
  } catch (error) {
    console.log(error)
    return 0
  }
}

// 获取文章数量
export const queryArchivesCount = () => githubFetchCount(`${blog}/issues?state=open&per_page=100`)

// 按分类（milestone 号）& 标签筛选文章数量
export const queryFilterArchivesCount = ({ label, milestone }) => {
  const params = new URLSearchParams({ state: 'open', per_page: '100' })
  if (label) params.set('labels', label)
  if (milestone) params.set('milestone', milestone)
  return githubFetchCount(`${blog}/issues?${params.toString()}`)
}

// 获取文章列表
export const queryPosts = ({ page = 1, pageSize = 10, filter = '' }) => {
  const url = `${blog}/issues?state=open&page=${page}&per_page=${pageSize}${filter}`
  return githubFetch(url)
}

// 获取单篇文章
export const queryPost = (number) => {
  const url = `${blog}/issues/${number}?state=open`
  return githubFetch(url)
}

// 获取分类
export const queryCategory = () => {
  const url = `${blog}/milestones`
  return githubFetch(url)
}

// 获取标签
export const queryTag = () => {
  const url = `${blog}/labels?page=1&per_page=100`
  return githubFetch(url)
}

// 获取书单 & 友链 & 关于
export const queryPage = (type) => {
  const upperType = type.replace(/^\S/, (s) => s.toUpperCase())
  const url = `${blog}/issues?state=closed&labels=${upperType}`
  return githubFetch(url, true)
}

// 获取生活记事（私有仓库，凭站长细粒度 PAT 访问）
// ponytail: 隐私由 GitHub 私有仓库 ACL 兜底——非拥有者即便带 token 也 404，
// 前端只负责展示门控；上限：单页拉 100 条，超出不分页。
export const queryLife = async (token) => {
  const repo = config.lifeOpts.repository
  const url = `${GITHUB_API}/${username}/${repo}/issues?state=open&per_page=100`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `token ${token}` },
    })
    if (!response.ok) return { ok: false, status: response.status, data: [] }
    return { ok: true, status: 200, data: await response.json() }
  } catch (error) {
    console.log(error)
    return { ok: false, status: 0, data: [] }
  }
}
