import { createApp, reactive } from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Layout and Font
import 'aos/dist/aos.css'
import 'gitalk/dist/gitalk.css'
import '@/assets/font/fontello.scss'
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import images from './assets/images'
import { isMobile } from './utils'
import { handleOAuthCallback } from './utils/auth'

const app = createApp(App)

// Global variable
app.config.globalProperties.$config = config
// Vue2 的 Vue.observable 在 Vue3 用 reactive 替代；组件内仍以 this.$isMobile.value 访问
app.config.globalProperties.$isMobile = reactive({ value: isMobile() })

app.use(router)
app.use(store)

// Init Site Title
const { title, subtitle } = config
document.title = `${title} | ${subtitle}`

// Init Cover
new Image().src = config.defaultCover

app.mount('#app')

// GitHub OAuth 回调：换取 token 后清理 URL 参数（软限制下载登录态）
handleOAuthCallback()

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
