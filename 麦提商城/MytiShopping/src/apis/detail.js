import request from '@/utils/http'

export const getDetail = (productId) => {
    return request({
        url: '/api/product/index/getProductDetials', 
        method: 'get',
        params: {
            productId: productId
        }
    })
}

export const fetchHotGoodsAPI = (productId, type, limit=3) => {
    return request({
        url: '/api/product/index/getHotProductByTime', 
        method: 'get',
        params: {
            productId: productId,
            type: type,
            limit: limit
        }
    })
}