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
export const addOneUser = userForm =>
  axios.request({
    method: 'post',
    url: '/users',
    data: userForm
  })
export const getOneUser = id =>
  axios.request({
    method: 'get',
    url: `/users/${id}`,
    params: {
      id: id
    }
  })
export const fixUser = fixUser =>
  axios.request({
    method: 'put',
    url: `/users/${fixUser.id}`,
    data: fixUser
  })
export const deleteUser = id =>
  axios.request({
    method: 'delete',
    url: `users/${id}`
  })
export const setUserRole = (id, rid) =>
  axios.request({
    method: 'put',
    url: `users/${id}/role`,
    data: {
      rid: rid
    }
  })
