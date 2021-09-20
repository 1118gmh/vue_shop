import axios from '../utils/ajaxRequest'
export const getCategories = queryInfo =>
  axios.request({
    method: 'get',
    url: '/categories',
    params: queryInfo
  })
export const addCategories = goodCategoriesInfo =>
  axios.request({
    method: 'post',
    url: '/categories',
    data: goodCategoriesInfo
  })
export const queryCategoriesById = id =>
  axios.request({
    url: `/categories/${id}`
  })
export const commitEditCategories = editCategoriesInfo =>
  axios.request({
    method: 'put',
    url: `categories/${editCategoriesInfo.cat_id}`,
    data: {
      cat_name: editCategoriesInfo.cat_name
    }
  })
export const deleteCategories = id =>
  axios.request({
    method: 'delete',
    url: `categories/${id}`
  })

export const getCateParams = (id, sel) =>
  axios.request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: {
      sel: sel
    }
  })
export const deleteParams = (cateId, attrId) =>
  axios.request({
    method: 'delete',
    url: `categories/${cateId}/attributes/${attrId}`
  })
export const addParams = (id, dataInfo) =>
  axios.request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data: dataInfo
  })
export const editParams = (cateId, attrId, editParamsInfo) =>
  axios.request({
    method: 'put',
    url: `categories/${cateId}/attributes/${attrId}`,
    data: editParamsInfo
  })
export const getParamsById = (cateId, attrId, attrSel) =>
  axios.request({
    method: 'get',
    url: `categories/${cateId}/attributes/${attrId}`,
    params: {
      attr_sel: attrSel
    }
  })
