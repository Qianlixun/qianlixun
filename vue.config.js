module.exports = {
  productionSourceMap: false,
  // 部署到 GitHub Pages 用户站点 qianlixun.github.io（根域名），资源前缀为 /
  publicPath: '/',
  chainWebpack(config) {
    const cdn = {
      // Google Fonts 已移除：国内不可达且会阻塞首屏，改用系统字体栈（见 src/styles/variables.scss）
      css: [],
      // jquery 与 jquery-backstretch 已自托管到 public/lib/，不再依赖任何外部 CDN
      js: ['/lib/jquery.min.js', '/lib/jquery.backstretch.min.js'],
    }
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      return args
    })
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/styles/variables.scss";
          @import "~@/styles/mixin.scss";
        `,
      },
    },
  },
}
