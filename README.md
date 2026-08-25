# 千里寻 — 个人综合主页

[![Author](https://img.shields.io/badge/author-Qianlixun-blue.svg?style=flat-square)](https://qianlixun.github.io)

> 寻遍千山，终见灯火。

千里寻 是一个基于 Vue 3 的单页应用个人主页，集「作品集（视频演示 + 源码归档）· 技术博客 · 私密生活记事 · 关于 · 联系」于一体。内容全部托管在 GitHub Issues 上（无后端、无数据库），通过 GitHub API 获取，GitHub Actions 自动构建发布到 GitHub Pages。

技术栈：Vue 3.4 + Vite 5 + Vuex 4 + Vue Router 4 + GitHub Issues + Gitalk。

在线访问：[qianlixun.github.io](https://qianlixun.github.io)

## 板块说明

| 板块 | 路由 | 内容源 |
| --- | --- | --- |
| 首页 | `/` | 精选作品 + 近期文章 |
| 作品集 | `/works` | `blog` 仓库 open issue，编号映射进 `config.js` 的 `projectResources` 即收录 |
| 博客 | `/blog` | `blog` 仓库 open issue（未映射进作品集的即为博客文章） |
| 生活 | `/life` | **私有仓库** `life` 的 open issue，站长粘贴细粒度 PAT 解锁后可见 |
| 关于 | `/about` | `blog` 仓库 closed issue（Label: `About`） |
| 联系 | `/contact` | `config.js` 的 `contactOpts.list`（全站联系方式唯一数据源） |

### 生活页（私密）原理

隐私由 GitHub 私有仓库 ACL 兜底：前端凭站长粘贴的细粒度 PAT 请求 `api.github.com/repos/<user>/life/issues`，非拥有者的令牌同样得到 404，**数据根本到不了浏览器**。使用前需：

1. 在 GitHub 创建**私有**仓库 `life`，每条 open issue 即一篇生活记录（标题 + Markdown 正文）；
2. 站长生成[细粒度 PAT](https://github.com/settings/personal-access-tokens/new)（仅选 `life` 仓库、Issues 只读），在生活页粘贴解锁。
   不用 OAuth 的原因：`github.com/login/oauth/access_token` 无 CORS 头，纯静态前端无法完成 code→token 交换。

## Getting Started

```bash
git clone git@github.com:Qianlixun/blog.git   # 源码仓库
cd blog
npm install
npm run dev      # 本地开发
```

修改 `src/config.js` 即可调整站点标题、导航、联系方式、作品映射等。

## Deployment

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）自动构建并发布到 `qianlixun.github.io`（需在仓库 Secrets 配置 `DEPLOY_KEY`）。无需手动部署脚本。

## License

MIT
