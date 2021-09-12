import axios from '../utils/ajaxRequest'

export const login = (username, password) => axios.request({
  method: 'post',
  url: 'login',
  data: {
    username: username,
    password: password
  }
})
