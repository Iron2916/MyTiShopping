import request from '@/utils/http'

export const getLikeListAPI = (limit) => {
    limit = 4
    return request({
      url:'/api/order/orderInfo/auth/relevant/' + limit,
      method: 'get'
    })
  }

export const getUserOrder = (pageNum, pageSize, orderStatus) => {
return request({
    url:'/api/order/orderInfo/auth/' + pageNum + '/' + pageSize,
    method:'get',
    params: {orderStatus}
})
}