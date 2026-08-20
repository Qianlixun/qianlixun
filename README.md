# 千里寻 · 个人站点

[![Author](https://img.shields.io/badge/author-Qianlixun-blue.svg?style=flat-square)](https://qianlixun.github.io)
[![Email](https://img.shields.io/badge/Email%20me-99498515@qq.com-green.svg?style=flat-square)](mailto:99498515@qq.com)

千里寻的个人站点：基于 **GitHub Issues** 写作、**GitHub API** 取数、**GitHub Pages** 免费托管的单页应用，无服务器、无数据库。评论采用 [Gitalk](https://github.com/gitalk/gitalk)。

技术栈：**Vue 3 + Vite 5 + vue-router 4 + vuex 4 + Gitalk + GitHub Pages**。

> 本站派生自开源主题 Aurora（chanshiyucx/yoi），已去除主题模板措辞与第三方 CDN 盗链，素材全部自托管，定位为**个人品牌站点**而非主题发布仓库。

在线访问：[千里寻](https://qianlixun.github.io)

## 本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:5173
npm run build    # 构建到 dist/
```

> 注意：本地预览时 Gitalk 评论无法正常加载，发布线上后正常。

## 部署（GitHub Actions 自动）

push 到 `master` 分支即触发 `.github/workflows/deploy.yml` 自动构建并发布到 `qianlixun.github.io`。

首次使用需配置一次：源码仓库 `Settings → Secrets and variables → Actions` 添加 `DEPLOY_KEY`（值为 `Qianlixun/qianlixun.github.io` 仓库 deploy key 的私钥）。

## 配置

修改 `src/config.js`，每个配置项均有说明。需你本人替换的素材（收款码）见文件内标注。

## License

派生自 Aurora（MIT）。本仓库沿用 MIT License。
