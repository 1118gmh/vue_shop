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
