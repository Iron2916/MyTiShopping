import request from '@/utils/http'

export const getOrderAPI = (id) => {
  return request({
    url: `/api/order/orderInfo/auth/${id}`
  })
}

export const updateOrder = (orderId, status, type) =>{
    return request({
        url: '/api/order/orderInfo/auth/updateStatus',
        method:'get',
        params: {orderId, status, type}
    })
}