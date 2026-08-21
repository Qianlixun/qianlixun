import config from '../config'
import documents from './documents'

const GRAPHQL_URL = 'https://api.github.com/graphql'
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

// 构建 GraphQL
const createCall = async (document) => {
  try {
    const payload = JSON.stringify({ query: document })
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: access_token ? { Authorization: access_token } : {},
      body: payload,
    })
    checkStatus(response)
    const body = await response.json()
    return body.data
  } catch (err) {
    console.log(err)
  }
}

// 获取文章数量
export const queryArchivesCount = () => createCall(documents.queryArchivesCount({ username, repository }))

// 按分类 & 标签筛选文章
export const queryFilterArchivesCount = ({ label, milestone }) =>
  createCall(documents.queryFilterArchivesCount({ username, repository, label, milestone }))

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
