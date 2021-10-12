import axios from '@/libs/api.request'


/****************接口start*****************/

/*************品类************/
// 获取所有品类（带分页）
export const getTypeList = (info) => {
  return axios.request({
    url: 'getTypeList',
    method: 'get',
    params: info
  })
}
// 获取所有品类(下拉)
export const getTypeAll = (info) => {
  return axios.request({
    url: 'getTypeAll',
    method: 'get',
    params: info
  })
}
// 添加单个品类
export const addType = (info) => {
  return axios.request({
    url: 'addType',
    method: 'post',
    data: info
  })
}
// 删除单个品类
export const delTypeOne = (info) => {
  return axios.request({
    url: 'delTypeOne',
    method: 'post',
    data: info
  })
}


/******订单*****/

// 获取所有订单
export const getOrderList = (info) => {
  return axios.request({
    url: 'getOrderList',
    method: 'get',
    params: info
  })
}
// 添加单个订单
export const addOrder = (info) => {
  return axios.request({
    url: 'addOrder',
    method: 'post',
    data: info
  })
}
// 删除单个订单
export const delOrderOne = (info) => {
  return axios.request({
    url: 'delOrderOne',
    method: 'post',
    data: info
  })
}

// 更新订单详情
export const updateOrderDetail = (info) => {
  return axios.request({
    url: 'updateOrderDetail',
    method: 'post',
    data: info
  })
}

// 获取订单基本详情
export const getOrderDetail = (info) => {
  return axios.request({
    url: 'getOrderDetail',
    method: 'get',
    params: info
  })
}

// 获取订单详情关联品类与数量
export const getOrderDetailTypeList = (info) => {
  return axios.request({
    url: 'getOrderDetailTypeList',
    method: 'get',
    params: info
  })
}
// 删除订单中关联品名与数量
export const delOrderDetailTypeOne = (info) => {
  return axios.request({
    url: 'delOrderDetailTypeOne',
    method: 'post',
    data: info
  })
}



/***************接口end******************/
export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
