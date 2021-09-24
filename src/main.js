// 引入全局样式表
import './css/global.css'
// 引入fontcss
import './assets/font/iconfont.css'
import './assets/fonts/iconfont.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui组件和它的样式表
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器和 它 的样式表
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 过滤器
import filters from '@/utils/filters'
for (const key in filters) {
  Vue.filter(key, filters[key])
}

// 全局注册树形表格
Vue.component('tree-table', TreeTable)
// 注册element-ui组件
Vue.use(ElementUI)
// 注册富文本编辑器为全局可用组件
Vue.use(VueQuillEditor /* { default global options } */)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
