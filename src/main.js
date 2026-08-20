import { createApp, reactive } from 'vue'
import APlayer from '@/components/APlayer'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import AV from 'leancloud-storage'

// Layout and Font
import 'aos/dist/aos.css'
import 'gitalk/dist/gitalk.css'
import 'katex/dist/katex.css'
import '@/assets/font/fontello.scss'
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import images from './assets/images'
import { isMobile } from './utils'

const app = createApp(App)

// Global variable
app.config.globalProperties.$config = config
// Vue2 的 Vue.observable 在 Vue3 用 reactive 替代；组件内仍以 this.$isMobile.value 访问
app.config.globalProperties.$isMobile = reactive({ value: isMobile() })

app.use(router)
app.use(store)

// 注册 APlayer 包裹组件（原 @moefe/vue-aplayer 仅支持 Vue2，已替换为基于原生 aplayer 的包裹组件）
app.component('APlayer', APlayer)

// Init Site Title
const { title, subtitle } = config
document.title = `${title} | ${subtitle}`

// Init Leancloud
window.AV = AV
AV.init(config.leancloud)

// Init Cover
new Image().src = config.defaultCover

app.mount('#app')

// (o=^•ェ•)o
const labelStyle = 'line-height:22px;color:#FFF;background:#D68FE9;'
const themeRepo = 'https://github.com/Qianlixun/qianlixun'
console.info(`%c ${config.title} %c`, labelStyle, '', window.location.origin)
console.info('%c Theme %c', labelStyle, '', themeRepo)
console.info('~❀~ 发现控制台报错请务必联系博主 ~❀~')
console.log(
  '%c ',
  `
  margin:5px 0;
  padding:0 0 162px 200px;
  overflow:hidden;
  border-radius:10px;
  background:url(${images.reimu}) no-repeat center;
  background-size:200px;
  `
)
