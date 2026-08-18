module.exports = {
  productionSourceMap: false,
  // 部署到 GitHub Pages 用户站点 qianlixun.github.io（根域名），资源前缀为 /
  publicPath: '/',
  chainWebpack(config) {
    const cdn = {
      css: ['//fonts.googleapis.com/css?family=Fira+Mono|Noto+Serif+SC&display=swap'],
      js: [
        '//cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js',
        '//cdn.jsdelivr.net/npm/jquery-backstretch@2.1.17/jquery.backstretch.min.js',
      ],
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
