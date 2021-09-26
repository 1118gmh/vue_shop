# vue_shop

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Tasks

1. 登录功能

```
- 通过element-ui组件配置对用户名、密码进行规则校验
- 重置功能
- 通过v-model双向绑定，获取数据
- 当点击登录时，通过表单的validate方法对表单进行校验，成功则提交，失败就退出
- 校验成功后，发送ajax请求，成功的返回结果后，根据status判断是否登录成功，若失败，就通过Message提示用户登录失败，若成功，就 提示登录成功 在sessionStorage中记录token 路由跳转home页面

- 退出登录 就清除token信息 并且路由跳转login页面
```

2. 首页的布局和绘制

```
- 通过el-container布局容器来布局head、aside、main
- head使用flex布局左右两栏，aside使用el-menu，
- 左侧菜单通过axios获取数据，失败提示失败信息，成功，则通过v-for绑定到组件中
- 左侧菜单的展开与折叠，先配置el-menu的collapse属性并且取消折叠特效，然后aside的width随之变化
- 当访问home时，需要重定向到home的子路由welcome,创建welcome组件，配置子路由，home中在ul-main容器里添加router-view，home路由redirect重定向到welcome
- 开启ul-emun的路由模式，router，它是根据index的值作为路由的路径，来跳转路由的
- 页面的路由激活高亮效果的保持，当点击二级菜单时，设置ul-enum的default-active值为当前路由路径，并且通过sessionStorage存储路由路径，当create时设置default-active的值为sessionStorage中的路由路径值（解决的是刷新页面时高亮的正常显示）；在添加home中添加监听函数监听路由的变化，当路由变化时
  watch: {
    $route(to, from) {
      this.activePath = to.path
    }
  },
```

3. 用户页面的绘制

```
- 配置用户页面的组件和路由，让其 在主页的main中展示
- 用户页面包括：面包屑区域、卡片区域、两个对话框；卡片区域中又有：搜索栏、用户列表表格、分页
- 展示用户列表，通过getUser获取用户信息，绑定到表格中，通过type属性添加一列索引栏，通过作用域插槽v-slot插入状态和操作按钮，根据scope.row属性获取用户的状态操作并且绑定。
- 分页效果：先绑定基础数据，绑定事件handleCurrentChange、handleSizeChange，当点击每页多少条或者点击第几页时会触发这两个事件，要改变queryInfo中的数据，并且重新发送getUser请求
- 当点击添加用户的时候，让对话框显示；对话框中是表单，要进行规则校验；在退出对话框时，要重置表单，通过触发close方法，执行表单上的resetFields方法；当点击确定时，触发点击事件，先进行表单验证，验证通过发送post请求，成功地获取到数据后，提示用户、退出对话框、getUser更新列表
- 当点击状态按钮时，触发点击事件，发送请求，若请求结果失败，则需要改变状态（因为点击的时候就自动改变一次，由于请求失败，再次改变，就相当于没变），提示用户失败。如果成功就提示用户修改成功
- 当点击修改用户按钮的时候，弹出对话框，需要发送put请求。。。
- 当点击删除用户按钮的时候，需要发送delete请求，在发送之前，要通过弹框再一次确认用户是否要删除，防止误删除
- 当点击设置按钮时tooltip文字提示来提示用户这个按钮时做啥的。

```

4. 权限管理

```
- 权限列表中的权限等级：根据当前juese的level值来显示不同的tag标签
- 点击'>'展示当前用户拥有的权限：通过<el-table-column type="expand"></el-table-column> 指定type属性为expand来是实现表格的点击下拉展示，通过插槽插入栏栅布局搭建结构，并且v-for循环绑定当前角色的children数据
- 添加角色操作：点击添加角色按钮，弹出（有表单的）对话框，点击确定时，发送post请求，当正确地返回了结果之后，提示用户、关闭对话框，更新列表
- 删除角色权限，点击'X'，先弹出是否确认删除的弹框，防止误删，当确定之后，发送delete请求，会返回当前角色的权限数据，直接通过role.children = res.data就可以了，（因为role是对象，指向的是堆内存，操作它可以直接改变堆内存中数据）
- 分配权限操作：点击分配权限，树形结构展示数据，发送请求获取所有的权限、递归获取所有当前角色的权限、弹出分配权限的对话框、获取用户的id（因为提交时要根据id给用户授权）。

- 用户列表中的分配角色操作：点击分配角色，弹出对话框，获取当前用户的角色信息并显示，获取所有角色信息并且绑定到下拉框中，确定时，根据下拉框选择的数据发送请求，更改用户的角色
```

5. 商品管理

```
- 商品分配的结构展示： table + tree 结构（通过npm install vue-table-with-tree-grid插件实现）
  // 导入
  import TreeTable from 'vue-cli-plugin-element-ui'
  // 注册
  Vue.component('tree-table', TreeTable) 或者  Vue.use(TreeTable)
  //使用
  根据 api 文档查看使用



图片的上传和移除，el-upload组件都封装好了，会自动发送ajax请求，然后添加或删除服务器上的图片。但是表单需要提交，需要获取到图片的路径，所以添加成功时要往表单中的图片数组中添加，移除成功时要将表单上的图片数组中移除对应的那一项。
- 图片上传功能：通过el-upload组件搭结构，指定上传到的服务器端的图片路径，同时还要指定图片上传的请求头中token信息，这样才可以正确上传成功。
由于这是一个表单，添加商品时要传递上传的图片路径，因此需要获取到上传成功后图片在服务器端的路径。
成功后，会返回一个响应数据，通过on-success属性监听上传图片成功的事件，获取到图片路径，保存到表单的图片数组pics属性中。
图片的移除：通过监听移除事件获取到当前图片的路径，然后查找到图片数组中中的对应图片的下标，然后移除
图片的预览：通过监听预览事件获取图片的绝对路径，并且赋给展示图片对话框中的img的src属性，并且让对话框显示

富文本框：通过vue-quill-editor插件实现
- 安装依赖 npm install vue-quill-editor
- 导入富文本编辑器和 它 的样式表
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
- 注册富文本编辑器为全局可用组件
Vue.use(VueQuillEditor /* { default global options } */)
- 组件中使用
  <quill-editor
    ref="myQuillEditor"
    v-model="addForm.goods_introduce"
  />
```

6. 订单管理

```
1. 省市联动效果实现
通过级联选择器绑定citydata数据实现
2. 物流进度查询
通过elementui组件中的时间轴实现
```

7. 数据统计

```
使用到报表，通过echarts插件实现
- 安装
- npm install echarts
- 引入
- import * as echarts from 'echarts'
- 使用
  -
  <div id="main" style="width:1100px;height:400px;"></div>
  -
  async mounted() {
    // 元素渲染完毕，在mounted中可以获取dom
    var myChart = echarts.init(document.getElementById('main'))
    // 获取服务器的返回的报表数据
    const res = await getData()
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 服务器返回的数据不完整，需要合并配置项
    const reportData = _.merge(res.data, this.options)
    myChart.setOption(reportData)
  }
```

8. 发送请求时的进度条特效

```
引入第三方插件nprogress
- 安装
  npm i nprogress --save
- 引入
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
- 使用
  NProgress.start()
  NProgress.done()
```

### notes

1. 语法处理：eslint 规范+prettier 格式化文件

```
.eslintrc.js文件
用于存放eslint的规范
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,// 禁用 函数前面有空格
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
可以在rules中修改或禁用eslint的默认规则

.prettierrc文件，需要自己手动创建，
当基于prettier格式化文档时，可以通过.prettierrc文件修改默认格式方式
{
  "jsxBracketSameLine": true, //jsx标签闭合位置，默认false，>会换行
  "bracketSpacing": true, //true对象内部前后有空格 { name: 'xiaoming' }
  "semi": false, // 格式化后末尾没有;
  "singleQuote": true // 格式化后变为单引号
}
```

2. element-ui 组件的按需导入

```
import {
  Button,
  Message,
  Confirm
} from 'element-ui'


Vue.use(Buttom)  // 通过标签使用

Vue.prototype.$message = Message  //挂载到组件上使用
Vue.prototype.$confirm = Confirm
```

### 项目优化

1. 生成打包报告

```
生成打包报告
- 命令行生成：vue-cli-serve build --report
- vue ui界面生成：运行build，查看控制台和分析，进行相关优化

```

2. 生产阶段 console 去除

```
可能会出现console的警告，需要在生产环境中配置babel-plugin-transform-remove-console插件

  npm i babel-plugin-transform-remove-console --save-dev
  然后在babel.config.js中配置plugin
  module.exports = {
    plugins: ['transform-remove-console']
  }
  这样会导致在开发阶段和生产阶段都生效，也就是所，开发阶段console的话打印不出消息了，
  因此需要这样修改
    // 这是项目发布阶段用到的babel插件
    const prodPlugins = []
    // 先判断当前的环境是不是生产阶段，是就添加这个插件
    if (process.env.NODE_ENV === 'production') {
      prodPlugins.push('transform-remove-console')
    }
    module.exports = {
      // 将其解构到plugins配置中
      plugins: [...prodPlugins]
    }

```

3. 通过 chainWebpack 自定义打包入口

```
不配置的话，默认情况下，开发环境和生产环境的打包入口都是main.js

配置自己的打包入口：
在vue.config.js中配置：
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }
}

```

4. 使用 externals 加载外部 CDN 资源

```
1. 在生产环境中配置externals，让其在打包的时候，import资源时不打包，直接到全局上查找对应的对象（全局上的对象通过在public文件中的index.html中引入cdn外部资源）
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress'
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }
}
2. 在生产环境中的main文件中，import的样式可以注释掉，通过下方在public中引入
    <!-- 引入富文本编辑器的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.bubble.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.core.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.snow.min.css" rel="stylesheet" />
    <!-- 引入进度条的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css" rel="stylesheet" />
3. 引入所需要的外部资源js文件
    <!-- 引入外部js资源，让其在window上挂载对象，通过配置external来找到全局上的对象 -->
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.1/vue-router.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.1.2/echarts.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js"></script>

对于element-ui的cdn引入方式，与其他不同，它不能external；
- 第一步，把main-prop.js中的导入element-ui的组件、样式注释掉
- 第二步，在index.html头部，通过cdn加载element-ui的js和css样式
<link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/theme-chalk/index.css" rel="stylesheet">
<script src="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/index.js"></script>

但是我测试了这种方式用不了，不知道为啥

明天试试html-webpack-externals-plugin插件实现

今天用html-webpack-externals-plugin插件实现上面的externals加载cdn资源
1. 将所有import的样式注释掉（只需要生产环境注释掉，开发环境下import就好），并且在html中引入cdn样式资源，（结合下一个优化方案：通过挂载prod属性判断是否引用这些外部cdn资源）
      <!-- 引入富文本编辑器的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.bubble.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.core.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.snow.min.css" rel="stylesheet" />
    <!-- 引入进度条的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css" rel="stylesheet" />
    <!-- 引入element-ui的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/theme-chalk/index.css" rel="stylesheet" />

2. 配置开发环境和生产环境的入口文件
    chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }

3. 通过html-webpack-externals-plugin插件在生产环境中配置这个插件，指定external的模块和cdn路径和全局名称
    const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

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
  值得注意的是，element-ui的配置：除了要上面一步这样通过插件引入element-ui组件,而且还要在生产环境中删除import的element-ui内容
    // import ElementUI from 'element-ui'
    // Vue.use(ElementUI)
  不然会报错

```

4. 首页内容定制

```
主要是为了实现
- 控制渲染页面的标题
- 按需加载外部cdn资源

实现步骤：
1. 通过html插件，给ta新增一个属性isProd，挂载到了htmlWebpackPlugin.options上,发布阶段是true，开发阶段是true
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
2. 在index.html中，通过<%= %>来配置值，通过<% %>来配置逻辑根据htmlWebpackPlugin.options.isProd属性判断开发、生产阶段

    <title><%= htmlWebpackPlugin.options.isProd ? '':'dev-' %>电商后台管理系统</title>

    <% if(htmlWebpackPlugin.options.isProd){ %>
    <!-- 引入富文本编辑器的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.bubble.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.core.min.css" rel="stylesheet" />
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.4/quill.snow.min.css" rel="stylesheet" />
    <!-- 引入进度条的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css" rel="stylesheet" />
    <!-- 引入element-ui的样式 -->
    <link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/theme-chalk/index.css" rel="stylesheet" />
    <% } %>
```

5. 路由的懒加载

```
需要配置babel插件：@babel/plugin-syntax-dynamic-import
- npm install --save-dev @babel/plugin-syntax-dynamic-import
- 在babel.config.js中配置
  {
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
这样操作之后才可以正常解析懒加载语法
component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue') //webpackChunkName是分组，分到同一组的会被一起解析

```

### 在本地部署上线

创建一个服务端项目 vue_shop_server，并且将打包的 dist 目录复制过来

1. node 创建 web 服务器

```
npm install express

const express = require('express')
const app = express()

app.use(express.static('./dist'))

app.listen(80,()=>{
  console.log('server running at http://127.0.0.1')
})
```

2. 开启 gzip 压缩

```
npm install compression -S

const express = require('express')
const compression = require('compression')
const app = express()

app.use(compression()) // 写在静态资源之前
app.use(express.static('./dist'))

app.listen(80,()=>{
  console.log('server running at http://127.0.0.1')
})
```

3. 配置 http 服务

```
1. 申请ssl证书，freessl网站免费申请，会获得一个公钥和一个私钥
2. 在后台项目中导入证书
  const https = require('https')
  const fs = require('fs')
  const options = {
    cert: fs.readFileSync('./full_chain.pem'),
    key: fs.readFileSync('./private.key')
  }
  https.createServer(options,app).listen(443) //要把上面的http协议的80端口注释掉
```

4. pm2 管理应用

```
npm install pm2 -g
pm2 start ...
pm2 ls
pm2 restart ...
pm2 stop ...
pm2 delete ...
```
