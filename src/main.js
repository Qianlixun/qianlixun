import { createApp, reactive } from 'vue'
import AV from 'leancloud-storage'

// Let's go!
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import images from './assets/images'
import { isMobile } from './utils'

// Layout and Font
import 'aos/dist/aos.css'
import 'gitalk/dist/gitalk.css'
import 'katex/dist/katex.css'
import '@/assets/font/fontello.scss'
import '@/styles/index.scss'

const app = createApp(App)

// Global variable（Vue3：Vue.prototype → app.config.globalProperties；Vue.observable → reactive）
app.config.globalProperties.$config = config
app.config.globalProperties.$isMobile = reactive({ value: isMobile() })

// Init Site Title
const { title, subtitle } = config
document.title = `${title} | ${subtitle}`

// Init Leancloud
window.AV = AV
AV.init(config.leancloud)

// Init Cover
new Image().src = config.defaultCover

app.use(router)
app.use(store)
app.mount('#app')

// (o=^•ェ•)o
const labelStyle = 'line-height:22px;color:#FFF;background:#D68FE9;'
const themeRepo = 'https://github.com/Qianlixun/qianlixun'
console.info(`%c ${config.title} %c`, labelStyle, '', window.location.origin)
console.info('%c Site %c', labelStyle, '', themeRepo)
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
