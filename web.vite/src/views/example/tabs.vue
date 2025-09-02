<template>
  <div class="demo-tabs">

    <div class="demo-content">
      
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :name="item.component" :key="index">
          <template #label>
            <div class="custom-tabs-label">
              <el-icon><calendar /></el-icon>
              <span>{{ item.name }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-alert style="margin-top: 10px;" title="使用高性能動態组件異步加載多個頁面數據" type="success"  :closable="false" show-icon />
      <keep-alive>
        <component ref="com" :is="activeName"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>

/*
   實現方式說明
     1、引用生成的vue頁面
     2、打開每個生成的頁面表.jsx文件，填寫taleAction屬性(對應實際表，用於權限判斷)，onInited同時减去上面tabs的高度
     3、可以打開下面三張表jsx文件找到taleAction及onInited重新設置表格高度屬性示例
*/
import {
  ref,
  reactive,
  defineExpose,
  markRaw,
  nextTick,
  defineEmits,
  getCurrentInstance,
  defineAsyncComponent
} from 'vue'

import customer from '@/views/dbtest/customer/Demo_Customer.vue'

export default {
  components: {
    customer,
    //異步引用组件
    order: defineAsyncComponent(() => import('@/views/dbtest/order/Demo_OrderStats.vue')),
   catalog: defineAsyncComponent(() => import('@/views/dbtest/catalog/Demo_Catalog.vue'))
  },
  setup() {
    const activeName = ref('customer')
    const tabs = reactive([
      { name: '客户管理', component: 'customer' },
      { name: '訂單管理', component: 'order' },
      { name: '基礎商品', component: 'catalog' }
    ])

    const handleClick = (item, event) => {
      activeName.value = tabs[item.index].component
    }

    const com=ref()
    return {
      tabs,
      activeName,
      handleClick,
      com
    }
  }
}
</script>

<style lang="less" scoped>
.demo-tabs {
   background: #f3f7fb;
  padding: 15px;
  position: absolute;
  width: 100%;
  height: 100%;
  .demo-content{
    height: 100%;
    padding: 0 10px;
    background: #fff;
  }
  ::v-deep(.grid-container) {
    padding: 0 !important;
  }
  ::v-deep(.view-header),
  ::v-deep(.demo-list) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
.custom-tabs-label {
  display: flex;
  position: relative;
  align-items: center;
  i {
    margin-right: 3px;
  }
}
.demo-tabs ::v-deep(.el-tabs__nav-wrap:after),
.demo-tabs ::v-deep(.el-tabs__active-bar) {
  height: 1px;
}
.demo-tabs ::v-deep(.el-tabs__header) {
  margin: 0px;
}
</style>
