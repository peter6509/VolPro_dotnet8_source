<template>
  <div class="tabs">
    <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
      <el-tab-pane label="產品顏色" name="color">
        <product-color ref="color"></product-color>
      </el-tab-pane>
      <el-tab-pane label="產品尺寸" name="size">
        <product-size ref="size"></product-size>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProductColor from '@/views/dbtest/product/Demo_ProductColor';
import ProductSize from '@/views/dbtest/product/Demo_ProductSize';
export default {
  components: {
    'product-color': ProductColor,
    'product-size': ProductSize
  },
  data() {
    return {
      activeName: 'color'
    };
  },
  methods: {
    tabClick(params) {
      console.log('選項卡點擊事件');
    },
    rowClick() {
      //主表(產品管理)點擊行事件
     
      //操作步驟2：調用兩張表明细表的查詢方法
      
      //浮脈查詢條件配置，見Demo_ProductColor.js、Demo_ProductSize.js文件
      this.$refs.color.$refs.grid.search();
      
      //加載尺寸明细表數據
      this.$refs.size.$refs.grid.search();
    }
  }
};
</script>
<style scoped>
.tabs {
  padding: 15px;
}
.tabs >>> .el-tabs {
  box-shadow: none;
}
.tabs >>> .el-tabs__content {
  padding: 0 !important;
  padding-bottom: 15px;
}
</style>
