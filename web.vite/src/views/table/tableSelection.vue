<template>
  <div class="table-item">
    <div class="table-item-header">
      <div class="table-item-border"></div>
      <span class="table-item-text">分頁/刷新數據保留複選框選擇狀態,複選框選中事件</span>
      <div class="small-text"></div>
      <div class="table-item-buttons">
        <div>
          <el-button type="primary" @click="getSelected" plain
            >獲取所有分頁選中行</el-button
          >
          <el-button type="primary" @click="clearSelection" plain
            >清除所有分頁選中行</el-button
          >
          <el-button type="primary" @click="reload" color="#95d475" plain>刷新</el-button>
        </div>
      </div>
    </div>
    <div
      style="line-height: 12px; font-size: 13px; padding: 0px 0 10px 10px; color: #0f92fb"
    >
      解决問題/功能:多頁或刷新表格數據後是否保留複選框選擇狀態,複選框選中事件(多頁選擇數據，最终顯示獲取所有分頁選中的數據)
    </div>

    <!-- 
       1、必須設置row-key與reserveSelection屬性後才能分頁選擇數據
       2、row-key為表格數據的唯一值字段(儘量是主鍵id字段)
       3、reserveSelection是否顯示分頁選中的數據
     -->
    <vol-table
      row-key="Id"
      :reserveSelection="true"
      ref="table"
      :url="url"
      index
      :columns="columns"
      :height="240"
      :pagination-hide="false"
      :load-key="true"
      :column-index="true"
    ></vol-table>
  </div>
</template>
<script lang="jsx">
import VolTable from "@/components/basic/VolTable.vue";
export default {
  components: {
    "vol-table": VolTable,
  },
  data() {
    return {
      //接口返回數據，可以框架生成的接口getPageData
      //如果是自定義的接口，需要返回的數據格式：{total:100,rows:[]}
      url: "api/sys_log/getPageData",
      columns: [
        {
          field: "Id",
          title: "Id",
          type: "int",
          width: 90,
          hidden: true,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "BeginDate",
          title: "開始時間",
          type: "datetime",
          width: 120,
          align: "left",
          sortable: true,
        },
        {
          field: "UserName",
          title: "用户名稱",
          type: "string",
          width: 90,
          align: "left",
        },
        {
          field: "Url",
          title: "請求地址",
          type: "string",
          width: 150,
          align: "left",
          showOverflowTooltip: true, //設置超出鼠標放上去提示
        },
        {
          field: "Success",
          title: "響應狀態",
          type: "int",
          bind: { key: "restatus", data: [] },
          width: 80,
          align: "left",
        },
        { field: "ElapsedTime", title: "時長", type: "int", width: 60, align: "left" },
        {
          field: "RequestParameter",
          title: "請求參數",
          type: "string",
          width: 150,
          align: "left",
        },
        {
          field: "ExceptionInfo",
          title: "異常信息",
          type: "string",
          width: 70,
          align: "left",
        },
        { field: "UserIP", title: "用户IP", type: "string", width: 90, align: "left" },
      ],
    };
  },
  methods: {
    getSelected() {
      const rows = this.$refs.table.getSelected();
      if (!rows.length) {
        this.$message.error("請選中行");
        return;
      }
      this.$message.success(`共選中【${rows.length}】行`);
    },
    clearSelection() {
      this.$refs.table.clearSelection();
      this.$message.success("清除成功");
    },
    delRow() {
      this.$refs.table.delRow();
      this.$message.success("删除成功");
    },
    reload() {
      this.$refs.table.load(null, true);
      this.$message.success("刷新成功");
    },
  },
};
</script>
<style lang="less" scoped>
.table-item-header {
  display: flex;
  align-items: center;
  padding: 6px;

  .table-item-border {
    height: 15px;
    background: rgb(33, 150, 243);
    width: 5px;
    border-radius: 10px;
    position: relative;
    margin-right: 5px;
  }

  .table-item-text {
    font-weight: bolder;
  }

  .table-item-buttons {
    flex: 1;
    text-align: right;
  }

  .small-text {
    font-size: 12px;
    color: #2196f3;
    margin-left: 10px;
    position: relative;
    top: 2px;
  }
}
</style>
