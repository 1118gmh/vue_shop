import axios from '../utils/ajaxRequest'

export const getData = () =>
  axios.request({
    url: 'reports/type/1'
  })
