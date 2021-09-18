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
