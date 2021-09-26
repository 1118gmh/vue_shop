// 这是项目发布阶段用到的babel插件
const prodPlugins = []
// 先判断当前的环境是不是生产阶段，是就添加这个插件
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // 将其解构到plugins配置中
  plugins: [...prodPlugins, '@babel/plugin-syntax-dynamic-import']
}
