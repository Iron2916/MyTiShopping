import request from '@/utils/http'
const baseUrl = '/api/product/index/'
// 获取 Banner 轮播图信息
export function getBannerAPI(type) {
    // 默认为1 商品为2
    return request({
      url: baseUrl + 'getBannerImgs/' + type,
      method: 'get' 
    })
  }

// 获取新鲜毫无
export function getNewProducts(limit) {
    
    return request({
        url: baseUrl +'getNewProducts/'+ limit,
        method: 'get'
    })
}

// 获取人气推荐商品
export function getHotProduct() {
    
    return request({
        url: baseUrl +'getHotProduct',
        method: 'get'
    })
}

  