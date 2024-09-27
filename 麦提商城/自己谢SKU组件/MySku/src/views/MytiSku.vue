<template>
    <div class="products-sku">
      <dl v-for="item in products.specs" :key="item.id">
        <dt>{{ item.key }}</dt>
        <dd>
          <template v-for="val in item.valueList" :key="val.name">
            <img v-if="val.picture" 
              @click="changeSku(item, val)" 
              :class="{ selected: val.selected, disabled: val.disabled }"
              :src="val.picture"
              :title="val.name">
            <span v-else 
              @click="changeSku(item, val)" 
              :class="{ selected: val.selected, disabled: val.disabled }">{{ val.name }}</span>
          </template>
        </dd>
      </dl>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, defineProps} from 'vue'
  import powerSet from '@/views/Composables/powerSet.js'
  
  
  // 调用poweSet算法，创建生成路径字典对象函数
  const getPathMap = (products) => {
    const pathMap = {}
    // 1. 得到所有有效的Sku集合 
    const effectiveSkus = products.skus.filter(sku => sku.stockNum > 0)
    // 2. 根据有效的Sku集合使用powerSet算法得到所有子集 [1,2] => [[1], [2], [1,2]]
    effectiveSkus.forEach(sku => {
      // 2.1 获取可选规格值数组
      const selectedValArr = sku.skuSpec.split(" + ")
      // 2.2 获取可选值数组的子集
      const valueArrPowerSet = powerSet(selectedValArr)
      // 3. 根据子集生成路径字典对象
      // 3.1 遍历子集 往pathMap中插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据Arr得到字符串的key，约定使用-分割 ['蓝色'，'美国'] => '蓝色-美国'
        const key = arr.join('-')
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    })
    return pathMap
  }
  
  // 获取商品生成路径
  const props = defineProps(['products'])
  const products = ref(props.products)
  console.log(products.value.specs);
  let pathMap = {}
  pathMap = getPathMap(products.value)
  console.log(pathMap);
  onMounted(() => {
    
      initDisabledState(products.value.specs, pathMap)
  })
  
  
  // 选中和取消选中实现，并实现将sku信息传递给父组件以及每次的库存判断
  const emit =  defineEmits(['Change'])
  const changeSku = (item, val) => {
    // 点击的是未选中，把同一个规格的其他取消选中，当前点击项选中，点击的是已选中，直接取消
    if (val.selected) {
      val.selected = false
    } else {
      item.valueList.forEach(valItem => valItem.selected = false)
      val.selected = true
    }
    updateDisabledState(products.value.specs, pathMap)
  
      // 产出SKU对象数据
    const index = getSelectedValues(products.value.specs).findIndex(item => item === undefined)
    if (index > -1) {
      // 信息不完整直接发送null
      emit('Change',null)
    } else {
      console.log('没有找到，信息完整，可以产出')
      // 获取sku对象
      const key = getSelectedValues(products.value.specs).join('-')
      const skuIds = pathMap[key]
      if (skuIds===undefined) return
      // 以skuId作为匹配项去products.value.skus数组中找
      const skuObj = products.value.skus.find(item => item.id === skuIds[0])
      console.log('sku对象为', skuObj)
      emit('Change',skuObj)
    }
  }
  
  
  // 根据库存初始化判断是否能选择： 商品源数据 pathMap：路径字典
  const initDisabledState = (specs, pathMap) => {
    // 约定：每一个按钮的状态由自身的disabled进行控制
    specs.forEach(item => {
      item.valueList.forEach(val => {
        // 路径字典中查找是否有数据 有-可以点击 没有-禁用
        val.disabled = !pathMap[val.name]
      })
    })
  }
  
  // 获取选中匹配数组 ['黑色',undefined,undefined]
  const getSelectedValues = (specs) => {
    const arr = []
    specs.forEach(spec => {
      const selectedVal = spec.valueList.find(value => value.selected)
      arr.push(selectedVal ? selectedVal.name : undefined)
    })
    return arr
  }
  
  // 每次点击后根据获取选中匹配数组进行循环判断
  const updateDisabledState = (specs, pathMap) => {
    // 约定：每一个按钮的状态由自身的disabled进行控制
    specs.forEach((item, i) => {
      const selectedValues = getSelectedValues(specs)
      console.log(selectedValues);
      item.valueList.forEach(val => {
        if (val.selected) return
        const _seletedValues = [...selectedValues]
        _seletedValues[i] = val.name
        const key = _seletedValues.filter(value => value).join('-')
        // 路径字典中查找是否有数据 有-可以点击 没有-禁用
        val.disabled = !pathMap[key]
      })
    })  
  }
  
  </script>
  
  
  <style scoped lang="scss">
  @mixin sku-state-mixin {
    border: 1px solid #e4e4e4;
    margin-right: 10px;
    cursor: pointer;
  
    &.selected {
      border-color: #27ba9b;
    }
  
    &.disabled {
      opacity: 0.6;
      border-style: dashed;
      cursor: not-allowed;
    }
  }
  
  .products-sku {
    padding-left: 10px;
    padding-top: 20px;
  
    dl {
      display: flex;
      padding-bottom: 20px;
      align-items: center;
  
      dt {
        width: 50px;
        color: #999;
      }
  
      dd {
        flex: 1;
        color: #666;
  
        >img {
          width: 50px;
          height: 50px;
          margin-bottom: 4px;
          @include sku-state-mixin;
        }
  
        >span {
          display: inline-block;
          height: 30px;
          line-height: 28px;
          padding: 0 20px;
          margin-bottom: 4px;
          @include sku-state-mixin;
        }
      }
    }
  }
  </style>