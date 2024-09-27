import request from '@/utils/http'

const baseUrl = "/api/product/index/"
export function getCategoryAPI() {
  return request({
    url: baseUrl + 'findecategoryAndProduct',
    method:'get'
  })
}