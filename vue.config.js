const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
module.exports = {
  devServer: {
    // 跨域请求：PROXY代理
    proxy: {
      '/': {
        target: 'http://127.0.0.1:8888/api/private/v1/',
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    // config.plugins = []; // 这样会直接将 plugins 置空
    if (process.env.NODE_ENV === 'production') {
      return {
        // return的话会合并plugins
        plugins: [
          new HtmlWebpackExternalsPlugin({
            externals: [
              {
                module: 'vue',
                entry: 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js',
                global: 'Vue'
              },
              {
                module: 'vue-router',
                entry: 'https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.1/vue-router.min.js',
                global: 'VueRouter'
              },
              {
                module: 'axios',
                entry: 'https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js',
                global: 'axios'
              },
              {
                module: 'lodash',
                entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js',
                global: '_'
              },
              {
                module: 'echarts',
                entry: 'https://cdn.bootcdn.net/ajax/libs/echarts/5.1.2/echarts.min.js',
                global: 'echarts'
              },
              {
                module: 'nprogress',
                entry: 'https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js',
                global: 'NProgress'
              },
              {
                module: 'element-ui',
                entry: 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/index.js',
                global: 'ElementUI'
              }
            ]
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      // 通过html插件，给ta新增一个属性isProd，挂载到了htmlWebpackPlugin.options上,发布阶段是true，开发阶段是true
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      // 通过html插件，给ta新增一个属性isProd,发布阶段是true，开发阶段是true
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
