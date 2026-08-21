#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下
cd dist

# 部署到 GitHub Pages 用户站点（qianlixun.github.io 的 master 分支）
git init
git checkout -b master
git add -A
git commit -m 'deploy'

# 推送到 Qianlixun/qianlixun.github.io 仓库的 master 分支
# 用户站点默认从 master 分支发布，推送后约 1 分钟可访问 https://qianlixun.github.io
git push -f git@github.com:Qianlixun/qianlixun.github.io.git master

cd -
