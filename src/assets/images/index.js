// 素材自托管到 public/assets/，路径带 BASE_URL 前缀适配子路径部署
// （背景轮播与主题预览图已随 jquery-backstretch 一并移除）
const B = import.meta.env.BASE_URL
export default {
  reimu: `${B}assets/img/reimu.svg`,
}
