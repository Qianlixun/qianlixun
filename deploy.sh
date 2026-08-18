#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下
cd dist

# 部署到 GitHub Pages（gh-pages 分支）
git init
git checkout -b gh-pages
git add -A
git commit -m 'deploy'

# 推送到 Qianlixun/qianlixun 仓库的 gh-pages 分支
# 部署后请在仓库 Settings → Pages 选择 gh-pages 分支作为页面来源
git push -f git@github.com:Qianlixun/qianlixun.git gh-pages

cd -
