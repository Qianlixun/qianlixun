# AGENTS.md — 千里寻站点项目约定

## 技术栈说明

- **前端框架**：Vue 3（Options API 为主）+ Vue Router 4（history 模式，`/archive → /blog` 重定向保旧链接）+ Vuex 4
- **构建工具**：Vite 5（`vite.config.js`：`@` 别名、SCSS 全局变量注入 `additionalData`、`manualChunks` 手动分包——marked/katex/highlight/gitalk 独立 chunk 按需加载）
- **样式**：SCSS（`src/styles/`，variables/mixin 全局注入；PC/SP 双端变量体系，`isMobile = body.clientWidth < 876`）
- **内容架构**：GitHub Issues 即内容源——`blog` 仓库 open issue 为作品/文章（编号进 `config.projectResources` 即作品集），closed issue + Label（`About` 等）为板块页；私有仓库 `life` 为生活记事
- **隐私方案**：生活页走 GitHub 私有仓库 ACL——站长在页面粘贴细粒度 PAT（仅 life 仓库、Issues 只读），api.github.com 直连（CORS 友好），非拥有者令牌 404 数据不落浏览器。**禁用 OAuth 浏览器换 token**：`github.com/login/oauth/access_token` 无 CORS 头，纯前端必挂
- **评论**：Gitalk（`config.gitalk`，clientSecret 明文为既有设计约定；proxy 置空时评论登录不可用——同上 CORS 限制，评论渲染不受影响）
- **交互组件**：仅 `nprogress` 进度条、`zooming` 图片放大、AOS 滚动动画；Live2D/APlayer/jquery-backstretch 背景轮播均已移除，**禁止复活**
- **部署**：GitHub Pages + `.github/workflows/deploy.yml`（push 到 `main` 自动构建发布，需 `DEPLOY_KEY` secret；`build` 脚本额外复制 `dist/index.html` 为 `dist/404.html` 作 history 路由 fallback）

## 代码风格约定

- 遵循极简主义：以最少的代码解决问题，不过度设计、不建无必要的抽象层
- 刻意简化的实现需以 `ponytail:` 注释标注，并点明已知上限与升级路径
- 信任边界的输入校验、防数据丢失的错误处理、安全相关代码**不极简**
- 中文注释优先；git 提交信息用中文、动词开头
- API 资源走 `import.meta.env.BASE_URL`，不在代码里硬编码域名/绝对路径
- 资产一律自托管到 `public/assets/`，禁止盗链第三方 CDN 与 Google Fonts

## 目录结构规范

- `src/views/`：Home/Works/Archive(博客)/Life/Post/Category/Tag/About/Contact 九个视图，**路由懒加载**（动态 import），新页面照此办理
- `src/components/`：公共组件（目录内 `index.vue` + 同目录 `index.scss` 局部样式；`ProjectCard`/`ProjectResource` 为作品集专用）
- `src/utils/`：services.js（GitHub API 封装，token 为空回退匿名）、auth.js（PAT 存取/`isOwner` 站长校验）、format.js、index.js
- `public/assets/`：仅 `img/`（SVG 图标与 favicon）；`bg/`（背景轮播图）与 `lib/`（jquery）已移除
- 新增静态资源一律自托管，禁止外链原作者资源

## 规则自更新约定

- 后续工作中发现新的通用约定（命名、错误处理模式、性能基线等），主动追加到本文件对应章节
- 本项目环境特殊性：`github.com:443` 常不可达但 `api.github.com` 可用，Git 推送需走 Contents API 逐文件提交（Git Data API 建 tree 遇 `.github/` 路径会 403）
- 实测站点渲染用系统 Chrome 无头（`--headless=new`）+ CDP 真实时间等待（`--dump-dom` 的虚拟时间机制会误报 SPA 未渲染）
