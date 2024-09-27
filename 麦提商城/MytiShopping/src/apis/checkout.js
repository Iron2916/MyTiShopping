import request from '@/utils/http'

export const getCheckoutInfoAPI = () => {
    return request({
        url: '/api/order/orderInfo/auth/orderPreInfo',
        method: 'get'
    })
}

export const createOrderAPI = (orderInfoDto) => {
    return request({
        url: '/api/order/orderInfo/auth/submitOrder',
        method: 'post',
        data:orderInfoDto
    })
}