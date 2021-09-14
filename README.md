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

<<<<<<< HEAD
=======
2. 首页的布局和绘制

```
- 通过el-container布局容器来布局head、aside、main
- head使用flex布局左右两栏，aside使用el-menu，
- 左侧菜单通过axios获取数据，失败提示失败信息，成功，则通过v-for绑定到组件中
- 左侧菜单的展开与折叠，先配置el-menu的collapse属性并且取消折叠特效，然后aside的width随之变化
- 当访问home时，需要重定向到home的子路由welcome,创建welcome组件，配置子路由，home中在ul-main容器里添加router-view，home路由redirect重定向到welcome
- 开启ul-emun的路由模式，router，它是根据index的值作为路由的路径，来跳转路由的
- 页面的路由激活高亮效果的保持，当点击二级菜单时，设置ul-enum的default-active值为当前路由路径，并且通过sessionStorage存储路由路径，当beforecreate时设置default-active的值为sessionStorage中的路由路径值，
```

>>>>>>> users
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
