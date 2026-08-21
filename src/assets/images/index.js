// 所有素材已自托管到 public/assets/，不再依赖外部图床（原作者图床已失效）
// 背景图来自免费图库（bilibili 图床，国内可用），已下载到 public/assets/bg/
// 路径统一带 BASE_URL 前缀，适配 GitHub Pages 子路径部署
const B = import.meta.env.BASE_URL
export default {
  sakura: `${B}assets/img/sakura.svg`,
  reimu: `${B}assets/img/reimu.svg`,
  preview: {
    touhou: `${B}assets/img/touhou.svg`,
    school: `${B}assets/img/school.svg`,
  },
  bg: {
    touhou: [
      `${B}assets/bg/touhou-01.jpg`,
      `${B}assets/bg/touhou-02.jpg`,
      `${B}assets/bg/touhou-03.jpg`,
      `${B}assets/bg/touhou-04.jpg`,
      `${B}assets/bg/touhou-05.jpg`,
      `${B}assets/bg/touhou-06.jpg`,
      `${B}assets/bg/touhou-07.jpg`,
      `${B}assets/bg/touhou-08.jpg`,
      `${B}assets/bg/touhou-09.jpg`,
      `${B}assets/bg/touhou-10.jpg`,
    ],
    school: [
      `${B}assets/bg/school-01.jpg`,
      `${B}assets/bg/school-02.jpg`,
      `${B}assets/bg/school-03.jpg`,
      `${B}assets/bg/school-04.jpg`,
      `${B}assets/bg/school-05.jpg`,
      `${B}assets/bg/school-06.jpg`,
      `${B}assets/bg/school-07.jpg`,
      `${B}assets/bg/school-08.jpg`,
      `${B}assets/bg/school-09.jpg`,
    ],
  },
}
