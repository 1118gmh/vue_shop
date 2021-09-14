import axios from '../utils/ajaxRequest'

export const getMenus = () =>
  axios.request({
    url: '/menus'
  })
