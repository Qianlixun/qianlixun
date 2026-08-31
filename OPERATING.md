# 站长操作手册

> 本手册面向 `Qianlixun/qianlixun` 站点站长，记录日常内容管理的具体操作位置和流程。
> 技术细节见 [AGENTS.md](./AGENTS.md)，二次开发见 [README.md](./README.md)。

## 1. 删除/隐藏 Issue（#1 / #4 / #5 等）

GitHub Issue **设计上只能"关闭"不能"删除"**，关闭后站点前端因为只拉 `state=open`，所以会自动从博客/作品集列表消失。

### 1.1 在 GitHub 网页关闭（最快）
1. 打开 https://github.com/Qianlixun/blog/issues
2. 点击要删除的 issue（如 #1 欢迎来到千里寻、#4 Vue3 模板脚手架、#5 REST vs GraphQL 选型记录）
3. 在 issue 详情页底部点 **"Close issue"** 按钮
4. 站点刷新（前端 60 秒缓存过期）后该 issue 从列表消失

### 1.2 彻底删除（仓库 owner 专属，2023 后 GitHub 新功能）
1. 打开 issue 详情页
2. 右侧边栏滚到最下方，找到 **"Delete issue"**（红色文字，需 owner 权限）
3. 点确认——此操作不可恢复，但 issue 编号永远占着不会复用

### 1.3 批量关闭（REST API）
```bash
# 关闭单个 issue（把 NUMBER 换成 1/4/5）
curl -X PATCH -H "Authorization: Bearer <PAT>" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/Qianlixun/blog/issues/NUMBER \
  -d '{"state":"closed"}'
```
> PAT 需勾选 `Qianlixun/blog` 的 `Issues: Read and write`。

## 2. 新增博客文章

### 2.1 最快路径（纯文本文章，无视频/源码）
1. 打开 https://github.com/Qianlixun/blog/issues/new
2. **标题** = 文章标题
3. **正文第一行**遵循格式（封面 + 描述）：
   ```
   [封面标题](https://raw.githubusercontent.com/Qianlixun/medias/main/<封面文件名>.jpg)
   一句话摘要，会显示在文章卡片上
   ```
   * 没有封面就空一行，前端会回退到本地 `defaultCover.svg`（深炭黑+金占位图）
   * **封面 URL 不能含紫粉 hex**（如 `b28fce`/`b854d4`/`cf95e8`/`f596aa`/`fbc2eb`/`a18cd1`/`a64fd0`），否则前端黑名单兜底会回退到默认封面
4. 正文其余部分用 Markdown 写正文
5. 点 **"Submit new issue"**
6. 站点 60 秒后出现在 `/blog` 列表

## 3. 新增作品集项目（出现在 `/works`）

作品集比博客多两步：**必须接线 `config.js` 的 `projectResources`**，否则 issue 即使开打也只算博客文章。

### 3.1 完整流程（带视频/源码下载）

#### 准备资产
- 演示视频 mp4（≤100MB，超出走 [B 站 bvid](./src/components/ProjectResource.vue) 不传 medias）
- 源码包 zip（可选）
- 封面图 jpg/png（16:9 推荐，≤100MB）

#### 上传资产到 medias 仓库
```bash
# 单文件上传（mp4/jpg/png/zip 都行）
node .workbuddy/redesign/src/upload-media.mjs <本地文件路径> <目标文件名> <PAT>
# 输出 raw 直链，记下来待会儿填进 config.js
```
> PAT 需勾选 `Qianlixun/medias` 的 `Contents: Read and write`。

#### 创建 issue
1. https://github.com/Qianlixun/blog/issues/new
2. 标题 = 项目名
3. 正文第一行写 `[项目名](<封面 raw 直链>)`
4. 正文其余写项目简介、技术要点等
5. 提交，记下 issue 编号（如 #7）

#### 接线 config.js
编辑 [src/config.js](./src/config.js) 的 `projectResources` 字段：
```js
projectResources: {
  6: { mp4: '<视频 raw 直链>' }, // 现场信号设备检修实录
  7: { mp4: '<视频 raw 直链>', zip: '<源码 zip raw 直链>' }, // 你的新项目
}
```
- 只写 `mp4` → 详情页显示"在线演示"
- 加 `zip` → 详情页同时显示"源码下载"
- 有 `bvid` 字段优先走 B 站 iframe，不走本地 mp4

#### 提交源码触发部署
```bash
# 用 PAT 推送 config.js 到 main，触发 CI 自动部署
node .workbuddy/redesign/src/push-files.mjs <PAT> qianlixun "新增作品 #7" \
  . src/config.js
```
> PAT 需勾选 `Qianlixun/qianlixun` 的 `Contents: Read and write`。

### 3.2 一键脚本（参考实现，定制用）
[.workbuddy/redesign/src/deploy-finish.mjs](./.workbuddy/redesign/src/deploy-finish.mjs)
是"现场信号设备检修"项目的端到端一键脚本，幂等可重跑：
- 上传演示视频 + 简历 + 源码包到 medias
- 创建作品 issue
- 接线 config.js（导出的 `wireConfig()` 是核心逻辑）
- 推送 main 触发 CI

新项目要复用，复制该脚本改顶部三个常量：`VIDEO` / `VIDEO_DEST` / `ISSUE_TITLE`。

### 3.3 多视频 + 长视频项目（HLS 切片方案，推荐）

当一个项目有多个演示视频、或单视频超过 100MB（GitHub 单文件限制），用 **HLS（HTTP Live Streaming）** 方案：
- 视频用 `ffmpeg -f hls` 切成多个 `.ts` 小段（每段 ≤85MB，确保 < GitHub 100MB 单文件硬限）+ 1 个 `.m3u8` 播放清单
- 全部上传到 medias 仓库
- 前端 [ProjectResource.vue](./src/components/ProjectResource.vue) 用 `hls.js` 加载 `.m3u8`，访客看到的是单视频无缝播放（按需加载段，体验等同普通 mp4）
- 多视频项目通过 `project.hls: [{name, src}]` 数组配置，下方有视频切换按钮

#### 切分+上传脚本（git push 一次性提交）
```bash
# 用法：node .workbuddy/redesign/src/hls-split-git-push.mjs <视频目录> <项目前缀如 v1> <PAT> [--dry-run]
# 实测：V1.0 目录 4 个视频共 1.86GB → 切 26 段 + 4 个 m3u8，约 30 分钟
# 实测：V2.0 目录 9 个视频共 3.4GB → 切 79 段 + 9 个 m3u8，分批 push 约 60 分钟

# Dry-run 先估算段数（不实际上传）
node .workbuddy/redesign/src/hls-split-git-push.mjs "I:\千里寻\videos\《...》" v1 dummy --dry-run
```

脚本会自动：
1. 用 `ffprobe` 拿时长/码率，算出 `segment_time`（每段目标 ≤85MB，留 5MB 余量）
2. `ffmpeg -c copy -f hls` 直切不转码（秒级完成）
3. **自适应重切**：检测到某段 >90MB（码率峰值导致）自动 `segment_time *= 0.7` 重切，最多 3 次
4. 浅克隆 medias 仓库 → 复制全部 `.ts` + `.m3u8` → 一次 commit + push
5. 输出 `config.js` 的 `hls: [{name, src}]` 片段，复制粘贴即可

#### 分批 push（脚本崩了或 push 失败时续传）
```bash
# 当 git push 因 github.com:443 间歇不可达失败时，用分批脚本按视频分组 commit + push
node .workbuddy/redesign/src/push-v2-batches.mjs
# 前提：.hls-tmp-<prefix> 切片已生成、.medias-clone-<prefix> 工作副本已就位
```

#### config.js 接线
```js
// projectResources 中的对应 issue 编号加 hls 字段
6: {  // V1.0
  hls: [
    { name: 'S700K拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-S700K拆装.m3u8' },
    { name: '信号机部件拆分', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-信号机部件拆分.m3u8' },
    { name: '剪辑版视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-剪辑版视频.m3u8' },
    // 完整版视频切片（v1-现场信号设备检修完整版视频.m3u8）已在 medias 仓库作站内备份，但不暴露给前端播放（长度过长体验不佳）
  ],
},
```

#### 完整版视频站内备份约定
- **站内备份**：原版完整版视频也切片上传到 medias 仓库（命名 `<prefix>-<slug>.m3u8` + 段）
- **不暴露前端**：在 `config.js` 的 `hls[]` 数组里用注释保留，不写实际 `{name, src}` 条目
- **为什么这样设计**：完整版通常 30 分钟+，访客看剪辑版即可；但站长需保留原版可追溯、可二次剪辑
- **如需临时启用**：把对应注释行改成 `{ name: '完整版视频', src: '<m3u8 raw 直链>' },` 即可

#### 注意事项
- **PAT 权限**：`Qianlixun/medias` 的 `Contents: Read and write`
- **github.com:443 间歇不可达**：`git push` 失败先重试 3 次（脚本已内置 60s/120s/180s 退避）；仍失败改用 `push-v2-batches.mjs` 分批 push，或 `upload-v2-contents.mjs` Contents API 兜底（但 >75MB 单文件 Contents API 会 422）
- **Contents API 75MB 软限制**：单文件 >75MB 时 Contents API 会 422，必须走 git push
- **跨域**：`raw.githubusercontent.com` 默认 CORS 允许，前端 `crossorigin="anonymous"` 配合 hls.js 即可
- **Safari 原生支持 HLS**：组件 `canPlayType('application/vnd.apple.mpegurl')` 检测到就走原生路径，不加载 hls.js
- **hls.js 分包**：[vite.config.js](./vite.config.js) 已把 `hls.js` 分到独立 chunk，不进首屏
- **下载**：HLS 不适合直接下载原视频，组件中已移除"下载演示视频"按钮（仅 `project.mp4` 才显示）；如需下载原版，到 medias 仓库直接下载 m3u8 内列出的所有 .ts 段后用 ffmpeg 合并

### 3.4 多仓库 HLS 方案（大型项目集，推荐）

当一个项目的视频总量超过单仓库推荐上限（GitHub 建议 ≤5GB/仓库），或一个项目集合（多个 issue）的视频总量达 10GB+ 时，**按项目分仓库存储切片**：

- 每个项目对应一个独立的 `medias-<slug>` 仓库（如 `medias-platform-door`、`medias-v1-onboard`）
- 仓库单文件仍是 `.ts` 段 + `.m3u8` 清单，命名加项目前缀（如 `platform-周巡检操作视频-00000.ts`）
- 前端 `config.js` 的 `hls[].src` 直接指向对应仓库的 `raw.githubusercontent.com/Qianlixun/medias-<slug>/main/...`

#### 切片粒度（关键：单段 ≤10MB）

**段大小目标 ≤10MB**（脚本 `hls-split-to-repo.mjs` 的 `SEGMENT_MAX_MB=10`，重切阈值 12MB）。

历史教训：曾用 ≤85MB 段目标，短视频被切成单段 44MB，hls.js 默认 `fragLoadingTimeOut=20s` 下不完 → `net::ERR_ABORTED` 重试 6 次共 120s 超时 → 视频黑屏。改 ≤10MB 后 hls.js 20s 内能稳定下完一段。

[ProjectResource.vue](./src/components/ProjectResource.vue) 已同步调大 hls.js 超时作双保险：`fragLoadingTimeOut=60s`、`fragLoadingMaxRetry=6`、`manifestLoadingTimeOut=30s`、`levelLoadingTimeOut=30s`。

#### 当前多仓库清单（2026-08 状态）

| 仓库 | 项目（issue #） | 文件数 | 备注 |
|------|----------------|--------|------|
| `medias` | #6 现场信号 V1.0 + #7 现场信号 V2.0 + 早期资源（封面/简历/源码包/视频） | 139 | #6 暴露 3 段 + 完整版备份；#7 暴露 8 段 + 2 段备份（考试系统/去 logo 版） |
| `medias-platform-door` | #8 站台门检修 | 见仓库 | 3 个教学视频 |
| `medias-basic-signal` | #10 信号基础设备 | 52 | 单仓库 |
| `medias-afc-ticket` | #11 AFC 售票机 | 159 | 单仓库 |
| `medias-afc-gate` | #12 AFC 检票机 | 104 | 单仓库 |
| `medias-v1-onboard` | #13 车载 V1.0 | 116 | 单仓库 |
| `medias-v2-onboard` | #14 车载 V2.0 | 115 | 含完整版备份 |
| `medias-dental` | #9 口腔医学 | 见仓库 | 单仓库 |

> 新建项目仓库：在 GitHub 网页或 `gh repo create Qianlixun/medias-<slug> --public` 创建空仓库（不勾选 README），让脚本能直接 push。

#### 切分+推送脚本（指定目标仓库）

```bash
# 用法：GH_MEDIA_PAT=... node .workbuddy/redesign/src/hls-split-to-repo.mjs --src <源目录> --repo <仓库名> --prefix <项目前缀> [--branch main] [--dry-run] [--backup-names 完整版1,完整版2]
#
# --src         源视频目录（递归扫描子目录里的 mp4/mkv）
# --repo        目标仓库名（如 medias-platform-door）
# --prefix      切片文件名前缀（如 platform，生成 platform-周巡检操作视频-00000.ts）
# --backup-names 完整版视频文件名列表（不含扩展名），逗号分隔。这些视频也会切片上传，
#                但生成的 src 不暴露给前端（在 config.js 片段里注释掉）

# 实测：站台门 3 个视频 → medias-platform-door，约 15 分钟
GH_MEDIA_PAT=ghp_xxx node .workbuddy/redesign/src/hls-split-to-repo.mjs \
  --src "I:/千里寻/videos/《城市轨道交通站台门检修维护教学系统》" \
  --repo medias-platform-door \
  --prefix platform

# Dry-run 先估算段数（不实际上传）
GH_MEDIA_PAT=dummy node .workbuddy/redesign/src/hls-split-to-repo.mjs \
  --src "I:/千里寻/videos/《...》" --repo medias-<slug> --prefix <slug> --dry-run

# 含完整版备份：把"完整版"切片上传但不暴露前端
GH_MEDIA_PAT=ghp_xxx node .workbuddy/redesign/src/hls-split-to-repo.mjs \
  --src "I:/千里寻/videos/《车载信号设备虚拟仿真 V2.0》" \
  --repo medias-v2-onboard \
  --prefix v2-onboard \
  --backup-names "现场完整版,操作完整版"
```

脚本流程：
1. 递归扫描 `--src` 下所有 `mp4`/`mkv`，每个视频 `ffprobe` 拿时长/码率
2. `ffmpeg -c copy -f hls` 直切（每段目标 ≤85MB），自适应重切（>90MB 自动 `segment_time *= 0.7`，最多 3 次）
3. 浅克隆目标仓库到 `.medias-clone-<prefix>/`，复制全部 `.ts` + `.m3u8`
4. 一次性 `git commit + push`，失败自动重试（github.com:443 间歇不可达时退避 60s/120s/180s）
5. 输出 `config.js` 的 `hls: [{name, src}]` 片段，完整版视频以注释形式保留

#### 分批 push（一次性 push 失败时续传）

当 `hls-split-to-repo.mjs` 的一次性 push 因 github.com HTTP 500/RPC 超时失败时（多见于单视频量大、文件多），改用分批脚本按视频分组、子批 commit+push：

```bash
# 用法: node .workbuddy/redesign/src/push-v1-v2-batches.mjs <cloneDir> <prefix>
#   cloneDir = 本地 git clone 目录（含 .git，由 hls-split-to-repo.mjs 创建为 .medias-clone-<prefix>）
#   prefix   = 切片文件名前缀（与 hls-split-to-repo.mjs 的 --prefix 一致）
#
# 实测：v2-onboard 80 个文件分 21 组（每组 ≤5 文件 / ≤400MB），约 25 分钟
#        其中 1 次网络故障自愈（等 1min 重试成功），1 次 github.com 不可达累计等 8min 后恢复

node .workbuddy/redesign/src/push-v1-v2-batches.mjs "I:/千里寻/videos/.medias-clone-v2-onboard" v2-onboard
```

脚本策略：
- 按 `m3u8` 前缀分组（每个视频 = 一组），大组（>5 文件 或 >400MB）再拆小子批
- 每子批单独 commit + 立即 push（单 push 数据量小，更易成功）
- push 失败 → `ls-remote` 探测 github.com 可达性，不可达时指数退避（1/2/3/5/8/10/15min），最多等 90min
- `--soft reset` 到 `origin/main` 丢弃本地未推送的 commit 但保留文件，可幂等重跑

#### 多仓库 config.js 接线

```js
// projectResources 中的对应 issue 编号加 hls 字段，src 指向各项目仓库
8: {  // 城市轨道交通站台门检修维护教学系统
  hls: [
    { name: '周巡检操作视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-周巡检操作视频.m3u8' },
    { name: '更换门控器操作视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-更换门控器操作视频.m3u8' },
    { name: '站台门破损教学视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-站台门破损教学视频.m3u8' },
  ],
},
14: {  // 车载信号设备虚拟仿真 V2.0
  hls: [
    { name: 'M01 模拟器操作', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-M01.m3u8' },
    // ... 其他演示视频
    // 完整版视频（v2-onboard-现场完整版.m3u8）已在 medias-v2-onboard 仓库作站内备份，不暴露给前端
  ],
},
7: {  // 现场信号设备虚拟仿真 V2.0（主 medias 仓库，完整版/变体版切片仅备份不暴露前端）
  hls: [
    { name: '初级卷1·无拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-初级卷1无拆装.m3u8' },
    { name: '初级卷2·无拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-初级卷2无拆装.m3u8' },
    { name: '中级卷1·无拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-中级卷1无拆装.m3u8' },
    { name: '中级卷2·无拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-中级卷2无拆装.m3u8' },
    { name: '联动展示', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-现场信号仿真软件联动展示.m3u8' },
    { name: '联动展示·字幕版', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-现场信号仿真软件联动展示字幕.m3u8' },
    { name: '现场信号设备虚拟仿真', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-现场信号设备虚拟仿真.m3u8' },
    { name: '3D场景联动展示', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v2-虚拟仿真基地3D场景展示以及室内外的联动展示张乐尧.m3u8' },
    // 完整版/变体版（v2-现场信号设备虚拟仿真职业技能等级考试系统.m3u8、v2-现场信号仿真软件联动展示去掉logo版本.m3u8）已在 medias 仓库作站内备份，不暴露前端
  ],
},
```

#### github.com:443 间歇不可达的兜底

`hls-split-to-repo.mjs` 和 `push-v1-v2-batches.mjs` 都内置了重试，但若 github.com 长时间不可达（>90min），可改用 Git Data API 通过稳定的 `api.github.com` 推送源码接线：

```bash
# 仅用于推送 qianlixun 源码（config.js / package.json 等），不适用于 >75MB 的视频切片
node .workbuddy/redesign/src/push-qianlixun-via-api.mjs
```

> Git Data API 推送源码已触发 CI 构建即可，视频切片仍需等 github.com 恢复后用 `push-v1-v2-batches.mjs` 补传。

#### PAT 权限（多仓库）

`fine-grained PAT` 需在 `Repository access` 里勾选**所有 `medias-*` 仓库 + `Qianlixun/qianlixun` + `Qianlixun/blog`**，权限：`Contents: Read and write` + `Issues: Read and write`（blog 仓库用于建/改 issue）。

新建 `medias-<slug>` 仓库后，已发行的 PAT 不会自动获得新仓库权限，需到 https://github.com/settings/personal-access-tokens 重新编辑该 PAT，勾上新仓库后保存。

### 3.5 源码备份仓库（source-backup，私有）

私有仓库 `Qianlixun/source-backup` 存放 1+X 仿真项目源码 zip 备份。GitHub Release 单文件 2GB 限制，故大于 2GB 的 zip 用 7z 分卷成 1.9GB 切片上传。

- **仓库**：`Qianlixun/source-backup`（私有，默认分支 master）
- **备份内容**：16 个项目 zip / 82.62GB / 61 个分卷 + 16 个 manifest.json（2026-08-27 状态）
- **存储方式**：每个项目对应一个 Release（tag = `v-<slug>`），分卷文件 `xxx.zip.001/.002/...` + `manifest.json` 作为 asset 上传
- **完整性校验**：每个 Release 的 `manifest.json` 记录原 zip 大小、SHA256、各分卷大小+SHA256，恢复后可校验

#### 上传脚本

**单项目一气呵成**（推荐，process 模式自动 split → create → upload → 校验 → 删分卷）：

```bash
# 用法: UPLOAD_PAT=... node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT process <zipPath> <tag> <title> Qianlixun/source-backup
UPLOAD_PAT=github_pat_xxx node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT \
  process "I:/千里寻/Sources/《城市轨道交通站台门检修维护教学系统》/PlatformScreenDoor.zip" \
  v-platform "城市轨道交通站台门检修维护教学系统" Qianlixun/source-backup
```

**批量处理所有项目**（按从小到大排序，小项目先跑通，已完成的自动跳过）：

```bash
UPLOAD_PAT=github_pat_xxx node .workbuddy/redesign/src/batch-source-backup.mjs
```

**单功能模式**（出问题时分步排查）：

```bash
# 1. split   仅分卷 + 生成 manifest.json（不上传，输出到 <zipPath>.split/）
node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT split "I:/千里寻/Sources/《xxx》/yyy.zip"

# 2. create  仅创建空 Release（返回 release id）
node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT create v-xxx "项目标题" Qianlixun/source-backup

# 3. upload-dir  上传目录所有文件到指定 Release（已存在的 asset 自动跳过）
node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT upload-dir "I:/千里寻/Sources/《xxx》/yyy.zip.split" <releaseId> Qianlixun/source-backup

# 4. upload   上传单个文件到 Release（用于补传/重传某个分卷）
node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT upload "<分卷路径>" <releaseId> Qianlixun/source-backup

# 5. list  列出所有 Release 及其 asset（排查完整性用）
node .workbuddy/redesign/src/upload-release.mjs $UPLOAD_PAT list Qianlixun/source-backup
```

**脚本要点**：
- **全 curl API 调用**：Node.js fetch 在大文件上传后会失效（`fetch failed`），所有 API GET/POST 改用 `curl.exe`
- **curl 流式上传**：`--data-binary @file` 不读入内存，避免 1.9GB 文件爆内存
- **process 模式幂等可重跑**：先调 API 列 Release，若该 tag 的 asset 数 ≥ 期望分卷数则直接 return 跳过
- **7z 分卷**：`7z a -t7z -v<bytes>b -mx0 -y`，`-mx0` 不重复压缩（原 zip 已压缩）
- **SHA256 校验**：用 Node.js `crypto.createHash` 流式计算（7z 的 `h` 命令不支持 SHA-256 参数）
- **GitHub Release 单文件 2GB 限制**：分卷大小默认 1.9GB 留余量；< 2GB 的 zip 仍走分卷流程（只产 1 个 .001 + manifest），保持流程统一
- **PAT 必须有 `Administration: Write`**（建库时）和 `Contents: Write`（创 Release/上传 asset）

#### 恢复方法

私有库下载需 PAT 授权，**三步走**（详见仓库 [README.md](https://github.com/Qianlixun/source-backup/blob/master/README.md)）：

**第 1 步：下载某项目的所有 asset**

```powershell
$PAT = 'github_pat_...'  # 需 Contents: Read 权限
$H = @{ Authorization = "Bearer $PAT"; Accept = 'application/vnd.github+json' }
$tag = 'v-platform'  # 替换成要恢复的项目 tag
$rel = Invoke-RestMethod -Uri "https://api.github.com/repos/Qianlixun/source-backup/releases/tags/$tag" -Headers $H
foreach ($a in $rel.assets) {
  & curl.exe -s -L -H "Authorization: Bearer $PAT" -H "Accept: application/octet-stream" `
    -o "$($a.name)" "https://api.github.com/repos/Qianlixun/source-backup/releases/assets/$($a.id)"
}
# 产出: xxx.zip.001, xxx.zip.002, ..., manifest.json
```

**第 2 步：7z 合并还原成原 zip**

```powershell
& 'C:\Program Files\7-Zip\7z.exe' x 'xxx.zip.001'
# 7z 自动识别 .001/.002/... 序列合并，产出原 xxx.zip
```

**第 3 步：SHA256 校验（可选但推荐）**

```powershell
$m = Get-Content 'manifest.json' -Raw | ConvertFrom-Json
$actual = (Get-FileHash 'xxx.zip' -Algorithm SHA256).Hash.ToLower()
Write-Host "manifest.originalSha256: $($m.originalSha256)"
Write-Host "实际 SHA256:             $actual"
Write-Host "匹配: $($m.originalSha256 -eq $actual)"
```

#### PAT 权限

`fine-grained PAT` 需勾选 `Qianlixun/source-backup` 仓库：
- 备份上传：`Administration: Write`（建库时）+ `Contents: Write`（创 Release/上传 asset）
- 恢复下载：`Contents: Read` + `Metadata: Read`

## 4. 修改已有项目封面/内容

### 4.1 改封面图
1. 上传新封面到 medias：`node .workbuddy/redesign/src/upload-media.mjs <新图.jpg> <目标名.jpg> <PAT>`
2. 打开 https://github.com/Qianlixun/blog/issues/<编号>
3. 点 **"Edit"** 编辑正文第一行，改 `[标题](<新封面 raw 直链>)`
4. 保存即可，不需要重新部署前端

### 4.2 改视频源（B 站换本地 / 本地换 B 站）
- B 站换本地：上传 mp4 到 medias → 改 `config.js` 删 `bvid` 加 `mp4`
- 本地换 B 站：改 `config.js` 删 `mp4` 加 `bvid: 'BVxxxxxxxx'`

提交后用 push-files.mjs 推送 config.js。

## 5. PAT（个人访问令牌）权限清单

站长做全量操作需要 **fine-grained PAT**，权限矩阵：

| 仓库 | 权限 | 用途 |
|------|------|------|
| `Qianlixun/medias` | Contents: Read and write | 上传视频/封面/源码包 |
| `Qianlixun/medias-*`（platform-door / basic-signal / afc-ticket / afc-gate / v1-onboard / v2-onboard / 9-oral 等） | Contents: Read and write | 多仓库 HLS 视频切片存储（见 3.4） |
| `Qianlixun/blog` | Issues: Read and write | 创建/关闭/编辑 issue |
| `Qianlixun/qianlixun` | Contents: Read and write | 推送源码触发 CI；Workflows: Read and write（改 CI 配置时） |
| `Qianlixun/life` | Contents: Read | 生活页私密内容访问 |
| `Qianlixun/source-backup` | Contents: Read and write + Administration: Write（建库时） | 源码备份 Release（见 3.5） |

生成入口：https://github.com/settings/personal-access-tokens/new

## 6. CI 自动部署流程

1. 源码 push 到 `main` 分支
2. GitHub Actions 触发 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)
3. 构建 dist 并 push 到 `Qianlixun/qianlixun.github.io` master 分支
4. 访问 https://qianlixun.github.io/ 看效果（约 1 分钟）

CI 状态：https://github.com/Qianlixun/qianlixun/actions

## 7. 常用脚本速查

所有脚本在 [.workbuddy/redesign/src/](./.workbuddy/redesign/src/)：

| 脚本 | 用途 | 用法 |
|------|------|------|
| `upload-media.mjs` | 单文件传 medias | `node upload-media.mjs <本地> <目标名> <PAT>` |
| `push-files.mjs` | 多文件单提交推送 qianlixun（github.com:443 不可达时的替代） | `node push-files.mjs <PAT> qianlixun <message> <根目录> <file1> [file2...]` |
| `hls-split-git-push.mjs` | HLS 切片 + 浅克隆 medias + 一次性 push（单仓库早期方案） | `node hls-split-git-push.mjs <视频目录> <前缀如 v1> <PAT> [--dry-run]` |
| `hls-split-to-repo.mjs` | **多仓库方案**：HLS 切片 + 推送到指定 medias-<slug> 仓库（推荐） | `GH_MEDIA_PAT=... node hls-split-to-repo.mjs --src <源目录> --repo <仓库名> --prefix <前缀> [--dry-run] [--backup-names 完整版1,完整版2]` |
| `push-v1-v2-batches.mjs` | **多仓库分批续传**：按视频分组、子批 commit + push，github.com 不可达时自动退避重试（推荐续传方案） | `node push-v1-v2-batches.mjs <cloneDir> <prefix>` |
| `push-qianlixun-via-api.mjs` | Git Data API 推送 qianlixun 源码（github.com:443 长时间不可达时的兜底） | `node push-qianlixun-via-api.mjs`（仅源码，≤75MB） |
| `push-v2-batches.mjs` | 早期分批续传脚本（已被 push-v1-v2-batches.mjs 通用化取代） | `node push-v2-batches.mjs`（保留兼容） |
| `upload-v2-contents.mjs` | Contents API 兜底上传（单文件 ≤75MB 才行） | `node upload-v2-contents.mjs <PAT>` |
| `deploy-finish.mjs` | 一键端到端收尾（传视频+建 issue+接线+推送） | `node deploy-finish.mjs <PAT> [简历PDF] [源码zip]` |
| `sync-build.mjs` | 跨树同步源文件 | 按需调用 |

## 8. 验证线上效果（避免缓存误报）

```bash
# 用全新临时 user-data-dir 的 Chrome 无头模式
chrome --headless=new --user-data-dir=/tmp/chrome-fresh https://qianlixun.github.io/
```
> 不要复用浏览器 profile，旧 chunk 缓存会误报样式没生效。
> 本地开发：`npm run dev` → http://localhost:5173/

## 9. 常见陷阱

- **封面不显示**：检查 issue 正文第一行格式 `[标题](https://...)` 是否正确，URL 是否含紫粉 hex（被黑名单拦）
- **新 issue 不出现**：检查 state 是否 open；前端有 60 秒 GitHub API 缓存
- **视频不播放**：检查 medias 仓库文件是否 ≤100MB；ProjectResource 传的 `:loadCover="true"` 是否漏
- **CI 失败**：检查 `package-lock.json` 是否提交（setup-node cache:npm 依赖）；Node 版本 18+（CI 用 20）
- **生活页打不开**：`Qianlixun/life` 仓库未建或 PAT 没权限；Life 页有"清除令牌重输"按钮
- **git push 'Connection was reset'**：`github.com:443` 间歇不可达，15 分钟内自行恢复，或改用 push-files.mjs 走 API
