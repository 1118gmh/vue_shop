import axios from '../utils/ajaxRequest'

export const getRights = type =>
  axios.request({
    method: 'get',
    url: `/rights/${type}`
  })

export const getRolesData = () =>
  axios.request({
    url: '/roles'
  })

export const addRoles = addRolesBody =>
  axios.request({
    method: 'post',
    url: '/roles',
    data: addRolesBody
  })

export const getRoleById = id =>
  axios.request({
    url: `/roles/${id}`
  })
export const editRole = role =>
  axios.request({
    method: 'put',
    url: `/roles/${role.roleId}`,
    data: {
      roleName: role.roleName,
      roleDesc: role.roleDesc
    }
  })
export const deleteRole = id =>
  axios.request({
    method: 'delete',
    url: `/roles/${id}`
  })
export const deleteAuth = (roleId, authId) =>
  axios.request({
    method: 'delete',
    url: `roles/${roleId}/rights/${authId}`
  })
export const fixRoleRights = (roleId, rids) =>
  axios.request({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: {
      rids: rids
    }
  })
