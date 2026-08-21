# AGENTS.md — 千里寻站点项目约定

## 技术栈说明

- **前端框架**：Vue 3（Composition API 与 Options API 混用，沿用原 aurora 主题结构）+ Vue Router 4 + Vuex 4
- **构建工具**：Vite 5（`vite.config.js`，含 `resolve.extensions` 补 `.vue`、SCSS 全局变量注入 `additionalData`）
- **样式**：SCSS（`src/styles/`，variables/mixin 全局注入；PC/SP 双端变量体系，`isMobile = body.clientWidth < 876`）
- **内容架构**：GitHub Issues 即内容源（`config.js` 的 `repository: 'blog'` 仓库；GraphQL 查总数、REST 拉列表）
- **评论/热度**：Gitalk（评论）、leancloud-storage（热度统计）
- **部署**：GitHub Pages + `.github/workflows/deploy.yml`（需配置 `DEPLOY_KEY` 机密）

## 代码风格约定

- 遵循极简主义：以最少的代码解决问题，不过度设计、不建无必要的抽象层
- 刻意简化的实现需以 `ponytail:` 注释标注，并点明已知上限与升级路径
- 信任边界的输入校验、防数据丢失的错误处理、安全相关代码**不极简**
- 非平凡逻辑必须留一个可运行的最小校验（断言演示/自检或最小测试），完成后删除
- 中文注释优先；git 提交信息用中文、动词开头
- 依赖升级需谨慎：`autoprefixer` 等 vue-cli 时代隐式依赖在 Vite 下须显式声明

## 目录结构规范

- `src/views/`：页面视图（Home/Post/Archive/Category/Tag/Inspiration/Book/Friend/About），**路由懒加载**（动态 import），新页面照此办理
- `src/components/`：公共组件（目录内 `index.vue` + 同目录 `index.scss` 局部样式）
- `src/utils/`：services.js（GitHub API 封装，token 为空回退匿名）、format.js、documents.js（GraphQL 文档）
- `public/assets/bg|img|lib`：背景图、SVG 图标、自托管第三方库（禁止 jsdelivr 盗链与 Google Fonts）
- 新增静态资源一律自托管，禁止外链原作者资源

## 规则自更新约定

- 后续工作中发现新的通用约定（命名、错误处理模式、性能基线等），主动追加到本文件对应章节
- 本项目环境特殊性：`github.com:443` 常不可达但 `api.github.com` 可用，Git 推送需走 Git Data API（blobs/trees/commits/refs 全量树同步方案，注意 tree API 不接受 `sha:null` 删除条目）
- 实测站点渲染用系统 Chrome 无头（`--headless=new`）+ CDP 真实时间等待（`--dump-dom` 的虚拟时间机制会误报 SPA 未渲染）
