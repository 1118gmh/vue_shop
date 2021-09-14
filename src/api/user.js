import axios from '../utils/ajaxRequest'

export const getUsers = queryInfor =>
  axios.request({
    url: '/users',
    params: queryInfor
  })
export const setUserState = userInfo =>
  axios.request({
    method: 'put',
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`
  })
