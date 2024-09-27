import request from '@/utils/http'

/**
 * 根据一级分类标签获取一级分类标签的所有二级分类标签，以及对应推荐商品
 * @param {} categoryId 
 * @returns 
 */
export const serachByCategory1 = (categoryId) => {

    return request({
        url: '/api/product/index/serachByCategory1',
        method: 'get',
        params: {categoryId: categoryId}
    })
}

/**
 * 根据二级分类标签查询对应的下一级分类(具体分类)
 * @param {*} categoryId 
 * @returns 
 */
export const searchCategory2Childrens = (categoryId) => {

    return request({
        url: '/api/product/index/searchByCategory2',
        method: 'get',
        params: {categoryId: categoryId}
    })
}

/**
 * 根据二级分类标签进行查询所有的商品
 * @param {*} productSkuDto 
 * @param {*} pageNum 
 * @param {*} pageSize 
 * @returns 
 */
export const findeProduct = (productSkuDto, pageNum, pageSize) => {

    return request({
        url: '/api/product/index/searchByCategory2/' + pageNum + '/' + pageSize,
        method: 'post',
        data: productSkuDto
    })
}

/**
 * 查询出所有的品牌
 * @param {} categoryId 
 * @returns 
 */
export const getBrands = (categoryId) => {

    return request({
        url: '/api/product/index/getBrandsByCategoryId',
        method: 'get',
        params: {categoryId: categoryId}
    })
}
