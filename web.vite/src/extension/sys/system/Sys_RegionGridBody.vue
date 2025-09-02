<template>
  <div v-show="showList" class="list-content">
    <el-scrollbar style="height: 100%;">
      <el-descriptions v-for="(row, index) in rows" :key="index" class="margin-top" :column="4" :border="true">
        <el-descriptions-item :width="120" label="編碼"> {{ row.code }}</el-descriptions-item>
        <el-descriptions-item :width="100" label="名稱"> {{ row.name }}</el-descriptions-item>
        <el-descriptions-item :width="100" label="上级編碼"> {{ row.parentId }}</el-descriptions-item>
        <el-descriptions-item :width="120" label="级别"> {{ row.level }}</el-descriptions-item>
        <el-descriptions-item :width="120" label="經度"> {{ row.Lng}}</el-descriptions-item>
        <el-descriptions-item :width="120" label="緯度"> {{ row.Lat }}</el-descriptions-item>
        <el-descriptions-item :width="120" label="拼音" > {{ row.pinyin }}</el-descriptions-item>
        <el-descriptions-item :width="120" label="完整地址" > {{ row.mername }}</el-descriptions-item>
       <!-- 如果带有數據源，調用下面convertData方法轉換
        <el-descriptions-item :width="120" label="訂單狀態"> {{ convertData(row, '字段') }}</el-descriptions-item> -->
      </el-descriptions>
    </el-scrollbar>
  </div>
</template>
<script>
//這裡使用的vue2語法，也可以寫成vue3語法
export default {
  components: {

  },
  methods: {},
  data() {
    return {
      showList: false,
      rows: [],
      columns: []
    };
  },
  methods: {
    //界面的查詢方法，這裡重新绑定數據
    loadList(rows, columns) {
      this.rows = rows;
      if (!this.columns.length) {
        this.columns = columns;
      }
    },
    show() { //界面的點擊列表按鈕切換
      this.showList = !this.showList;
    },
    convertData(row, field) {//轉換數據源
      if (!this.columns.length) {
        return;
      }
      //  獲取數據源
      let data = this.columns.find(x => { return x.field == field }).bind.data;
      let val = row[field] + '';
      return (data.find(x => { return x.key + '' == val })||{value:val}).value;
    }
  }
};
</script>
<style lang="less" scoped>
.list-content {
  position: absolute;
    width: 100%;
    z-index: 99;
    height: calc(100vh - 244px);
    background: #ffff;
    right: 0;
    left: 0;
    bottom: 59px;
    padding: 0 16px;
}

.margin-top {
 // margin-bottom: 15px;

  ::v-deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
    font-weight: 500;
  }
}
</style>
