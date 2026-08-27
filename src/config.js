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
   * 项目资源映射：Issue 编号 → { repo: 公开源码仓库名, bvid: B站视频BV号, mp4: 演示视频直链, zip: 源码压缩包直链, hls: HLS视频列表 }
   * mp4/bvid/hls 至少填一个即显示视频区（hls 优先于 mp4，mp4 优先于 bvid）；zip 为源码压缩包直链，优先于 repo
   * hls: [{name, src}] 数组——src 是 .m3u8 清单 raw 直链，前端用 hls.js 加载，访客看到单视频无缝播放
   * 命中的 issue 归入「作品集」；下载为软限制（登录 GitHub 后显示入口）
   */
  projectResources: {
    1: { repo: 'qianlixun' }, // 站点源码仓库（欢迎文章）
    6: {  // 现场信号设备虚拟仿真 V1.0（主 medias 仓库，完整版切片仅备份不暴露前端）
      hls: [
        { name: 'S700K拆装', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-S700K拆装.m3u8' },
        { name: '信号机部件拆分', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-信号机部件拆分.m3u8' },
        { name: '剪辑版视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias/main/v1-剪辑版视频.m3u8' },
        // 完整版 v1-现场信号设备检修完整版视频.m3u8 已在 medias 仓库作站内备份，长度过长不暴露前端
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
    8: {  // 城市轨道交通站台门检修维护教学系统（medias-platform-door 仓库）
      hls: [
        { name: '周巡检操作视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-周巡检操作视频.m3u8' },
        { name: '更换门控器操作视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-更换门控器操作视频.m3u8' },
        { name: '站台门破损教学视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-platform-door/main/platform-站台门破损教学视频.m3u8' },
      ],
    },
    9: {  // 口腔医学数智化培训系统（medias-dental 仓库）
      hls: [
        { name: 'CBCT的使用方法与标准流程', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-CBCT的使用方法与标准流程.m3u8' },
        { name: '医护患时钟体位', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-医护患时钟体位.m3u8' },
        { name: '口腔一般检查', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-口腔一般检查.m3u8' },
        { name: '口腔门诊接诊话术洁牙术', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-口腔门诊接诊话术洁牙术.m3u8' },
        { name: '工具器械认知', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-工具器械认知.m3u8' },
        { name: '术前摆台', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-术前摆台.m3u8' },
        { name: '术后撤台', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-术后撤台.m3u8' },
        { name: '窝沟封闭·医生', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-窝沟封闭医生.m3u8' },
        { name: '窝沟封闭·咨询', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-窝沟封闭咨询.m3u8' },
        { name: '窝沟封闭·护士', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-窝沟封闭护士.m3u8' },
        { name: '诊间消毒', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-诊间消毒.m3u8' },
        { name: '超声波龈上洁牙术·医生', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-超声波龈上洁牙术医生.m3u8' },
        { name: '超声波龈上洁牙术·咨询', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-超声波龈上洁牙术咨询.m3u8' },
        { name: '超声波龈上洁牙术·护士', src: 'https://raw.githubusercontent.com/Qianlixun/medias-dental/main/dental-超声波龈上洁牙术护士.m3u8' },
      ],
    },
    10: {  // 信号基础设备检修虚拟仿真软件（medias-basic-signal 仓库）
      hls: [
        { name: 'JPXC-1000偏极继电器参数测试', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-JPXC-1000偏极继电器参数测试.m3u8' },
        { name: 'ZD6安装', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-ZD6安装.m3u8' },
        { name: 'ZD6拆除', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-ZD6拆除.m3u8' },
        { name: 'ZD6转辙机机械故障', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-ZD6转辙机机械故障.m3u8' },
        { name: 'ZDJ9转辙机测试', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-ZDJ9转辙机测试.m3u8' },
        { name: '读写工具读取应答器数据', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-读写工具读取应答器数据.m3u8' },
        { name: '信号机点灯单元故障', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-信号机点灯单元故障.m3u8' },
        { name: '信号基础设备检修虚拟仿真软件', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-信号基础设备检修虚拟仿真软件.m3u8' },
        { name: '信号检修VR操作视频', src: 'https://raw.githubusercontent.com/Qianlixun/medias-basic-signal/main/basic-信号检修VR操作视频.m3u8' },
      ],
    },
    11: {  // AFC 售票机检修（medias-afc-ticket 仓库，34 段视频）
      hls: [
        { name: '01·售票机设备概述', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-01售票机设备概述.m3u8' },
        { name: '01·售票机日常巡检', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-01售票机日常巡检.m3u8' },
        { name: '01·拆除更换电源模块', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-01拆除更换电源模块.m3u8' },
        { name: '01·乘客显示屏黑屏故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-01售票机乘客显示屏黑屏故障处理.m3u8' },
        { name: '02·售票机定期巡检', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-02售票机定期巡检.m3u8' },
        { name: '02·售票机电气结构与电气原理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-03售票机电气结构与电气原理.m3u8' },
        { name: '02·拆除更换主控单元', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-02拆除更换主控单元.m3u8' },
        { name: '02·乘客显示屏花屏故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-02售票机乘客显示屏花屏故障处理.m3u8' },
        { name: '03·售票机硬件接口介绍', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-04售票机硬件接口介绍.m3u8' },
        { name: '03·拆除更换IO板', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-03拆除更换IO板.m3u8' },
        { name: '03·乘客显示屏触摸无反应故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-03售票机乘客显示屏触摸无反应故障处理.m3u8' },
        { name: '04·拆除更换乘客显示器', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-04拆除更换乘客显示器.m3u8' },
        { name: '04·主控单元无法启动故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-04售票机主控单元无法启动故障处理.m3u8' },
        { name: '05·拆除更换维修面板', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-05拆除更换维修面板.m3u8' },
        { name: '05·打印机信号灯显示红色故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-05售票机打印机信号灯显示红色故障处理.m3u8' },
        { name: '06·拆除更换维护打印机', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-06拆除更换维护打印机.m3u8' },
        { name: '06·打印机无法通讯故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-06售票机打印机无法通讯故障处理.m3u8' },
        { name: '07·拆除更换运营显示器', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-07拆除更换运营显示器.m3u8' },
        { name: '07·读写器故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-07售票机读写器故障处理.m3u8' },
        { name: '08·单程票控制板故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-08售票机单程票控制板故障处理.m3u8' },
        { name: '09·硬币处理模块故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-09售票机硬币处理模块故障处理.m3u8' },
        { name: 'ECU·主控单元故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-ECU主控单元故障处理.m3u8' },
        { name: 'ECU·故障拆除和更换', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-ECU故障拆除和更换.m3u8' },
        { name: '电源模块·拆除和更换', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-电源模块拆除和更换.m3u8' },
        { name: '乘客显示屏黑屏', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-乘客显示屏黑屏.m3u8' },
        { name: '更换票盒', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-更换票盒.m3u8' },
        { name: '单程票补充', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机单程票补充.m3u8' },
        { name: '单程票回收操作', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机单程票回收操作.m3u8' },
        { name: '废票箱的废票操作', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机废票箱的废票操作.m3u8' },
        { name: '关机步骤', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机关机步骤.m3u8' },
        { name: '开机步骤', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机开机步骤.m3u8' },
        { name: '模块组成', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机模块组成.m3u8' },
        { name: '硬币补充操作', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机硬币补充操作.m3u8' },
        { name: '正常购票', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-ticket/main/afc-ticket-售票机正常购票.m3u8' },
      ],
    },
    12: {  // AFC 检票机检修（medias-afc-gate 仓库，24 段视频）
      hls: [
        { name: '设备概述', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机设备概述.m3u8' },
        { name: '模块组成', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机模块组成.m3u8' },
        { name: '电气原理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机电气原理.m3u8' },
        { name: '硬件接口介绍', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机硬件接口介绍.m3u8' },
        { name: '日常巡检', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机日常巡检.m3u8' },
        { name: '定期巡检', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机定期巡检.m3u8' },
        { name: '开机步骤', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机开机步骤.m3u8' },
        { name: '关机步骤', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机关机步骤.m3u8' },
        { name: '正常服务模式', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机正常服务模式.m3u8' },
        { name: '降级模式', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机降级模式.m3u8' },
        { name: '紧急模式', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机紧急模式.m3u8' },
        { name: '维修模式', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机维修模式.m3u8' },
        { name: '更换票盒', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机更换票盒.m3u8' },
        { name: '单程票回收模块故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机单程票回收模块故障处理.m3u8' },
        { name: '读写器故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机读写器故障处理.m3u8' },
        { name: '花屏故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机花屏故障处理.m3u8' },
        { name: '扇门单元故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机扇门单元故障处理.m3u8' },
        { name: '通道传感器故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机通道传感器故障处理.m3u8' },
        { name: '主控单元无法启动故障处理', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-检票机主控单元无法启动故障处理.m3u8' },
        { name: '乘客显示屏黑屏', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-自动检票机乘客显示屏黑屏.m3u8' },
        { name: '故障处理仿真培训系统', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-自动检票机故障处理仿真培训系统.m3u8' },
        { name: '检修作业仿真培训系统', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-自动检票机检修作业仿真培训系统.m3u8' },
        { name: '模块拆除和更换仿真培训系统', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-自动检票机模块拆除和更换作业仿真培训系统.m3u8' },
        { name: '认知仿真培训系统', src: 'https://raw.githubusercontent.com/Qianlixun/medias-afc-gate/main/afc-gate-自动检票机认知仿真培训系统.m3u8' },
      ],
    },
    13: {  // 1+X 车载信号 V1.0（medias-v1-onboard 仓库）
      hls: [
        { name: '和利时车载300S·初级1卷', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-和利时车载300S初级1卷.m3u8' },
        { name: '和利时车载300S·中级1卷', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-和利时车载300S中级1卷.m3u8' },
        { name: '300S速度传感器1轮径设置', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-300S速度传感器1轮径设置.m3u8' },
        { name: '300S下载RIM数据', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-300S下载RIM数据.m3u8' },
        { name: 'Hlscz200h20220420-13511905', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-Hlscz200h20220420-13511905.m3u8' },
        { name: 'Hlscz200h20220420-13590406', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v1-onboard/main/v1-onboard-Hlscz200h20220420-13590406.m3u8' },
      ],
    },
    14: {  // 1+X 车载信号 V2.0（medias-v2-onboard 仓库）
      hls: [
        { name: 'M01', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-M01.m3u8' },
        { name: 'M02', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-M02.m3u8' },
        { name: 'P01', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-P01.m3u8' },
        { name: 'P02', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-P02.m3u8' },
        { name: '练习卷1', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-练习卷1.m3u8' },
        { name: '练习卷2', src: 'https://raw.githubusercontent.com/Qianlixun/medias-v2-onboard/main/v2-onboard-练习卷2.m3u8' },
      ],
    },
    // 2: { repo: 'demo-project', bvid: 'BV1xx411c7mD' },
    // 3: { repo: 'demo', mp4: 'https://raw.githubusercontent.com/Qianlixun/medias/main/demo.mp4' },
  },

  /**
   * 主题配色，主要用于文章、灵感、关于等卡片配色
   * 参照 zg.gg：低饱和金 + 暖灰阶
   */
  themeColors: [
    '#c4a06a', // 主金
    '#9a7e54', // 暗金
    '#d4b483', // 亮金
    '#7a6442', // 低饱和金
    '#847f7a', // 暖灰
    '#5c5854', // 深灰
    '#b9a48a', // 沙金
    '#a39b94', // 中性暖灰
    '#e0b17b', // 浅金
    '#8c857e', // 灰褐
    '#6b635c', // 深褐灰
    '#d8d6d2', // 主文字色
  ],
}
