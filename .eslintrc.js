module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 视图组件按板块单词命名（Home/Works/Life...），路由即语义，无需多词
    'vue/multi-word-component-names': 'off',
    // Header/Footer 为既有布局组件名，模板内渲染的是原生 header/footer 元素
    'vue/no-reserved-component-names': 'off',
  },
  parserOptions: {
    // espree 随 eslint 内置，免装 babel-eslint（babel.config.js 已随 Vue CLI 移除）；
    // eslint 7 的 espree 最高支持 2021
    parser: 'espree',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
}
