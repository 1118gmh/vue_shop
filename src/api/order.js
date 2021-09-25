import axios from '../utils/ajaxRequest'

export const getOrders = queryInfo =>
  axios.request({
    method: 'get',
    url: '/orders',
    params: queryInfo
  })
export const getProcess = id =>
  axios.request({
    method: 'get',
    url: `/kuaidi/${id}`
  })
