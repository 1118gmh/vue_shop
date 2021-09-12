import axios from 'axios'
// import { Loading } from 'element-ui'

class AjaxRequest {
  constructor() {
    this.baseURL = ''
    this.timeout = 3000
    this.validateStatus = function(status) {
      // 自定义成功失败规则：resolve 、 reject(默认以2开头算成功)
      // 自定义以2/3开头算成功
      return /^(2|3)\d{2}$/.test(status)
    }
    // this.loading = Loading
    // 请求前增加请求队列，用于控制loading的显隐
    // this.queue = {}
  }

  setInterceptor(instance, url) {
    instance.interceptors.request.use(
      config => {
        // 每次请求前，将token放到请求中
        config.headers.token = sessionStorage.getItem('token')

        // 请求前显示loading
        // if (Object.keys(this.queue).length === 0) {
        // this.toast.service({ fullscreen: true })
        // }
        // 请求前增加请求队列
        // this.queue[url] = url
        return config
      },
      err => Promise.reject(err)
    )

    instance.interceptors.response.use(
      res => {
        // delete this.queue[url]
        // if (Object.keys(this.queue).length === 0) {
        // this.loading.close()
        // }
        return res.data
      },
      err => Promise.reject(err)
    )
  }

  request(options) {
    const instance = axios.create()
    const config = {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
      validateStatus: this.validateStatus
    }
    this.setInterceptor(instance) // 给这个实例增加拦截功能
    return instance(config)
  }
}

export default new AjaxRequest()
