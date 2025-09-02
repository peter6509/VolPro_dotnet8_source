<template>
  <div class="demo-tabs">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabs" :name="item.orderType" :key="index">
        <template #label>
          <div class="custom-tabs-label">
            <el-icon><calendar /></el-icon>
            <span>{{ item.name }}</span>
            <span v-if="item.count" class="item-qty">{{ item.count }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, defineExpose, defineEmits, getCurrentInstance } from 'vue'

const emit = defineEmits(['parentCall'])

const { proxy } = getCurrentInstance()

//默認選中項
const activeName = ref(-1)
const tabs = reactive([
  { name: '全部訂單', icon: '', orderType: -1, count: 0 },
  { name: '銷售訂單', icon: '', orderType: 1, count: 0 },
  { name: '採購訂單', icon: '', orderType: 2, count: 0 },
  { name: '退貨訂單', icon: '', orderType: 3, count: 0 },
  { name: '促銷訂單', icon: '', orderType: 4, count: 0 },
  { name: '預约訂單', icon: '', orderType: 5, count: 0 }
])

//獲取接口统計信息
const initData = () => {
  proxy.http.get('api/demo_order/getTotal', {}, false).then((res) => {
    tabs.forEach((item) => {
      res.forEach((c) => {
        if (c.orderType == item.orderType) {
          item.count = c.count
        }
      })
    })
  })
}

initData()

const handleClick = (item, event) => {
  emit('parentCall', ($parent) => {
    const orderType = tabs[item.index].orderType
    //點擊tabs刷新表格，並傳入查詢參數
    let params = {}
    //全部不傳條件
    if (orderType !== -1) {
      params.wheres = [{ name: 'OrderType', value: orderType }]
    }
    $parent.search(params, true)
  })
}

defineExpose({
  tabs,
  initData
})
</script>

<style lang="less" scoped>
.demo-tabs {
  padding: 10px 15px 0 15px;
}
.custom-tabs-label {
  display: flex;
  position: relative;
  align-items: center;
  i {
    margin-right: 3px;
  }
  .item-qty {
    position: absolute;
    background: #f21f0f;
    color: #fff;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    font-size: 10px;
    line-height: 20px;
    text-align: center;
    right: -19px;
    top: 6px;
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
