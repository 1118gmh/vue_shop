// 引入全局样式表
import './css/global.css'
// 引入fontcss
import './assets/font/iconfont.css'
import './assets/fonts/iconfont.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import filters from '@/utils/filters'
for (const key in filters) {
  Vue.filter(key, filters[key])
}
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
