// GitHub OAuth 登录（软限制下载用）
// ponytail: 纯前端换 token，clientSecret 暴露在源码（与 Gitalk 同款既有约定）。
// 已知上限：仅做"登录态展示"，不承担真实鉴权；token 存 localStorage 会随浏览器清空。
import config from '../config'

const TOKEN_KEY = 'gh_download_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const isLogged = () => !!getToken()
export const logout = () => localStorage.removeItem(TOKEN_KEY)

// OAuth 回调：URL 带 code 时换 token 并存下，随后清掉 URL 参数
export async function handleOAuthCallback() {
  const code = new URLSearchParams(location.search).get('code')
  if (!code) return false
  const { clientID, clientSecret } = config.gitalk
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: `client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
  })
  const data = await res.json()
  if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token)
  history.replaceState({}, '', location.pathname)
  return true
}

// 跳转 GitHub 授权页，回调回当前页
export function login() {
  const { clientID } = config.gitalk
  const redirect = encodeURIComponent(location.origin + location.pathname)
  location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirect}&scope=repo`
}

// 校验当前登录者是否站长本人（生活页拉取失败时用于区分"无权限"与"仓库未建"）
export async function isOwner(token) {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token || getToken()}` },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.login === config.username
  } catch (e) {
    return false
  }
}
