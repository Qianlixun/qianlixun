// 站长身份鉴权：生活页粘贴 GitHub 细粒度 PAT（仅 life 仓库、Issues 只读）解锁
// ponytail: token 明文存 localStorage，随浏览器清空/令牌过期失效，重新粘贴即可。
// 已知上限：仅做"登录态展示"，api.github.com 私有仓库 ACL 才是真隐私边界；
// 切忌改回 OAuth 浏览器换 token——github.com/login/oauth/access_token 无 CORS 头，纯前端必挂。
import config from '../config'

const TOKEN_KEY = 'gh_life_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, String(token).trim())
export const logout = () => localStorage.removeItem(TOKEN_KEY)

// 校验当前令牌持有者是否站长本人（拉取失败时区分"无权限"与"仓库未建/令牌未授权"）
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
