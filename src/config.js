/**
 * 千里寻 站点配置文件
 * 食用指南：https://github.com/Qianlixun/blog/issues/41
 */

// GitHub Pages 子路径前缀（构建时替换）
const B = import.meta.env.BASE_URL

export default {
  /**
   * =========================================================
   *                      站点功能【必需】
   * =========================================================
   */

  /**
   * 站点标题
   */
  title: '千里寻',
  subtitle: '寻遍千山，终见灯火', // 千里寻：踏遍千山路，终见那一点灯火

  /**
   * Github Issues 配置
   */
  username: 'Qianlixun', // github 用户名
  repository: 'blog', // 文章仓库地址
  token: [], // 填入你自己的 GitHub Token（读取 Issues 用），切勿提交真实令牌

  /**
   * Gitalk 配置，文档详见：https://github.com/gitalk/gitalk
   */
  gitalk: {
    clientID: 'Ov23liYx7QWOgIiNX9za',
    clientSecret: '6ffd934edb1b3a4917843deedc808920d714ac51',
    repo: 'comment', // 评论仓库地址
    owner: 'Qianlixun',
    admin: ['Qianlixun'],
    distractionFreeMode: false, // 是否开始无干扰模式【背景遮罩】
    // 注意：GitHub token 端点无 CORS 头，浏览器无法直连换 token——
    // 置空 proxy 时 gitalk 的评论登录实际不可用（评论渲染不受影响）；
    // 如需恢复评论登录，须自备可用 CORS 代理填到这里
    proxy: '',
  },

  /**
   * =========================================================
   *                        页面设置
   * =========================================================
   */

  /**
   * 归档页面（博客列表）
   */
  archiveOpts: {
    display: true, // 是否显示该页面
    enableComment: false, // 是否开启评论功能
    qoute: '華枝春滿 天心月圓', // 页面顶部一言
  },

  /**
   * 作品集页面
   * 收录规则：blog 仓库 open issue 且编号映射进 projectResources
   */
  worksOpts: {
    display: true,
    qoute: '代码与灯火，皆我所造',
  },

  /**
   * 生活页面（私密，仅站长本人可见）
   * 内容源：私有仓库（每条 open issue = 一篇生活记录，正文 Markdown）
   * 访问控制：站长在页面粘贴细粒度 PAT（仅本仓库、Issues 只读）解锁，
   * GitHub 私有仓库 ACL 兜底——非拥有者的令牌同样 404，数据不落浏览器
   */
  lifeOpts: {
    display: true,
    qoute: '山月不知心底事',
    repository: 'life', // 私有仓库名（需站长本人创建为 private）
  },

  /**
   * 联系页面
   * list 为全站联系方式唯一数据源（关于页图标墙同用此处）
   */
  contactOpts: {
    display: true,
    qoute: '若你也在寻山，不妨捎个信',
    heading: '联系千里寻',
    intro: '关于项目合作、技术交流或生活杂谈，都欢迎通过以下方式找到我。',
    mail: 'mailto:99498515@qq.com',
    list: [
      {
        name: '邮箱',
        desc: '99498515@qq.com',
        icon: `${B}assets/img/email.svg`,
        link: 'http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=tNnR9Nfc1drH3N3NwZrX29k',
      },
      {
        name: 'GitHub',
        desc: 'github.com/Qianlixun',
        icon: `${B}assets/img/github.svg`,
        link: 'https://github.com/Qianlixun',
      },
      {
        name: '网易云音乐',
        desc: '听歌记录与歌单',
        icon: `${B}assets/img/music.svg`,
        link: 'https://music.163.com/#/user/home?id=103060582',
      },
      {
        name: 'Twitter',
        desc: '@Qianlixun',
        icon: `${B}assets/img/twitter.svg`,
        link: 'https://twitter.com/Qianlixun',
      },
    ],
  },

  /**
   * 分类页面
   */
  categoryOpts: {
    display: true,
    enableComment: false,
    qoute: '桜華月想 暮色蒼然',
  },

  /**
   * 标签配置
   */
  tagOpts: {
    display: true,
    enableComment: false,
    qoute: '灯笼流丽，百鬼夜行',
  },

  /**
   * 关于页面
   */
  aboutOpts: {
    display: true,
    enableComment: true,
    qoute: '寻遍千山，终见灯火',
    graduated: 'University of Electronic Science and Technology of China (UESTC)',
    college: 'Communication&Information Engineering',
    // 简历 PDF 下载：自托管 medias 仓库 raw 直链，留空则「关于我」不显示下载按钮
    resume: {
      url: '',
      label: '下载简历 PDF',
    },
  },

  /**
   * =========================================================
   *                         主题自定义
   * =========================================================
   */

  /**
   * 加载动画
   */
  loadingImg: `${B}assets/img/loading.svg`,

  /**
   * 文章默认图
   */
  defaultCover: `${B}assets/img/defaultCover.svg`,

  /**
   * 项目资源映射：Issue 编号 → { repo: 公开源码仓库名, bvid: B站视频BV号, mp4: 演示视频直链, zip: 源码压缩包直链 }
   * mp4/bvid 至少填一个即显示视频区（mp4 优先）；zip 为源码压缩包直链，优先于 repo
   * 命中的 issue 归入「作品集」；下载为软限制（登录 GitHub 后显示入口）
   */
  projectResources: {
    1: { repo: 'qianlixun' }, // 站点源码仓库（欢迎文章）
    4: { repo: 'qianlixun' }, // 示例：Vue3 + Vite 模板（占位仓库，等你创建真实仓库后替换）
    5: { repo: 'qianlixun' }, // 示例：REST vs GraphQL 选型记录（占位仓库）
    // 2: { repo: 'demo-project', bvid: 'BV1xx411c7mD' },
    // 3: { repo: 'demo', mp4: 'https://raw.githubusercontent.com/Qianlixun/medias/main/demo.mp4' },
  },

  /**
   * 主题配色，主要用于文章、灵感、关于等卡片配色
   * 推荐一个超棒的取色站，日本の伝統色：http://nipponcolors.com/
   */
  themeColors: [
    '#B28FCE', // 薄
    '#86C166', // 苗
    '#F596AA', // 桃
    '#F19483', // 曙
    '#F9BF45', // 玉子
    '#FAD689', // 浅黄
    '#E79460', // 洗柿
    '#2EA9DF', // 露草
    '#FB966E', // 洗朱
    '#BC9F77', // 白茶
    '#867835', // 黄海松茶
    '#B9887D', // 水がき
  ],
}
