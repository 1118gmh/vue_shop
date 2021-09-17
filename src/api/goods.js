import axios from '../utils/ajaxRequest'
export const getCategories = queryInfo =>
  axios.request({
    method: 'get',
    url: '/categories',
    params: queryInfo
  })
