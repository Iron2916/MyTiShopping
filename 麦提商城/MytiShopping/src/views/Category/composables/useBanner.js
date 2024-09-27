// 封装banner轮播图相关的业务代码
import { ref, onMounted } from 'vue'
import { getBannerAPI } from '@/apis/home'

export function useBanner() {
  const bannerList = ref([])

  const getBanner = async() => {
    const res = await getBannerAPI(1)
    bannerList.value = res.data
  }

  onMounted(() => getBanner())

  return {
    bannerList
  }
}