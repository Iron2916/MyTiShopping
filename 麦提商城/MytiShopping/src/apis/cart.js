import request from '@/utils/http'

const baseUrl = 'api/order/cart/'

/**
 * 添加sku到购物车中
 * @param {*} skuId 
 * @param {*} skuNum 
 * @returns 
 */
export const addToCart = (skuId, skuNum) => {
    return request({
        url: baseUrl + 'auth/addToCart/' + skuId + '/' + skuNum,
        method: 'get'
    })
}

/**
 * 查询当前登录用户的购物车列表
 * @returns 
 */
export const getCartList = () => {
    return request({
        url: baseUrl + 'auth/cartList',
        method: 'get'
    })
}

/**
 * 删除购物车商品
 * @param {*} skuId 
 * @returns 
 */
export const delteCart = (skuId) => {
    return request({
        url: baseUrl + 'auth/deleteCart/' + skuId,
        method: 'delete'
    })
}

/**
 * 更新购物车的选中状态
 * @param {*} skuId 
 * @param {*} isChecked 
 * @returns 
 */
export const checkCart = (skuId, isChecked) => {
    return request({
        url: baseUrl + 'auth/checkCart/' + skuId + '/' + isChecked,
        method: 'get'
    })
}

/**
 * 购物车的全选或者全不选
 * @param {*} isChecked 
 * @returns 
 */
export const allCheckCart = (isChecked) => {
    return request({
        url: baseUrl + 'auth/allCheckCart/' + isChecked,
        method: 'get'
    })
}

/**
 * 清空购物车
 * @returns 
 */
export const clearCart = () => {
    return request({
        url: baseUrl + 'auth/clearCart',
        method: 'get'
    })
}

/**
 * 获得改用购物车商品里面已经选中的商品
 * @returns 
 */
export const getAllChecked = () => {
    return request({
        url: baseUrl + 'auth/getAllCkecked',
        method: 'get'
    })
}

/**
 * 合并用户离线状态的购物车里面的商品
 * @param {*} skuDtoList 
 * @returns 
 */
export const merge = (skuDtoList) => {
    return request({
        url: baseUrl + 'auth/merge',
        method: 'post',
        data: skuDtoList
    })
}