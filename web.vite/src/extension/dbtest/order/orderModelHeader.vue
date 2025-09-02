<template>
  <vol-box :lazy="true" v-model="model" title="選擇客户" :height="550" :width="1200" :padding="0">
    <div>
      <customer ref="customer"></customer>
    </div>
    <template #footer>
      <div>
        <el-button type="primary" size="mini" @click="onSelect">確認</el-button>
      </div>
    </template>
  </vol-box>
  <!-- 
   批量選擇明细表數據 -->
  <vol-box :lazy="true" v-model="detailModel" title="批量選擇明细表數據" :height="560" :width="1200" :padding="0">
    <div>
      <!-- 搜索配置 -->
      <div class="search-form">
        <label>商品名稱：</label>
        <el-input style="width:200px;" v-model="GoodsName"></el-input>
        <el-button size="small" type="primary" plain @click="search"><i class="el-icon-search"></i>搜索</el-button>
      </div>
      <!-- 表格數據 -->
      <vol-table ref="detailTable" :loadKey="true" :columns="columns" :pagination-hide="false" :height="420" :url="url"
        @loadBefore="loadBefore"></vol-table>
    </div>

    <template #footer>
      <div>
        <el-button type="primary" @click="detailSelectClick" size="mini">選擇數據</el-button>
      </div>
    </template>
  </vol-box>
</template>

<script>
import VolBox from '@/components/basic/VolBox.vue';
import customer from '@/views/dbtest/customer/Demo_Customer';
import VolTable from '@/components/basic/VolTable.vue';

//這裡使用的vue2語法，也可以寫成vue3語法
export default {
  emits: ['parentCall'],
  components: {
    'vol-box': VolBox,
    customer,
    VolTable
  },
  methods: {},
  data() {
    return {
      model: false, //彈出框
      detailModel: false, //批量選擇明细表數據model
      url: 'api/Demo_Order/getGoods',
      GoodsName: '', //商品名稱
      columns: [
        {
          field: 'GoodsId',
          title: '商品ID',
          type: 'guid',
          width: 110,
          hidden: true,
          readonly: true
        },
        {
          field: 'GoodsName',
          title: '商品名稱',
          type: 'string',
          link: true,
          width: 120,
          sort: true
        },
        { field: 'GoodsCode', title: '商品編號', type: 'string', width: 100 },
        { field: 'Img', title: '商品圖片', type: 'img', width: 80 },
        { field: 'Specs', title: '商品規格', type: 'string', width: 90 },
        { field: 'Price', title: '單價', type: 'decimal', width: 80 },
        {
          field: 'Enable',
          title: '是否可用',
          type: 'int',
          bind: { key: 'enable', data: [] },
          width: 90
        },
        { field: 'Remark', title: '備註', type: 'string', width: 100 },
        {
          field: 'CreateID',
          title: 'CreateID',
          type: 'int',
          width: 80,
          hidden: true
        },
        { field: 'Creator', title: '創建人', type: 'string', width: 80 },
        {
          field: 'CreateDate',
          title: '創建時間',
          type: 'datetime',
          width: 140,
          sort: true
        }
      ]
    };
  },
  methods: {
    open() {
      //打開主表選擇數據
      this.model = true;

      //打開時刷新界面數據(2022.12.06)
      this.$nextTick(() => {
        this.$refs.customer && this.$refs.customer.$refs.grid.search();
      });
    },
    openDetail() {
      //打明细表批量選擇
      this.detailModel = true;

      //刷新表格的數據
      this.$nextTick(() => {
        this.$refs.detailTable &&
          this.$refs.detailTable.$refs.table.load(null, true);
      });
    },
    onSelect() {
      //主表的選擇數據回寫到主表的表單上
      let rows = this.$refs.customer.$refs.grid.getSelectRows();
      if (!rows.length) {
        return this.$message.error('請選擇數據');
      }
      this.$emit('parentCall', ($parent) => {
        //如：調用頁面查詢
        $parent.editFormFields.Customer = rows[0].Customer;
        $parent.editFormFields.CustomerId = rows[0].CustomerId;
        $parent.editFormFields.PhoneNo = rows[0].PhoneNo;
        this.model = false;
      });
    },
    detailSelectClick() {
      //回寫數據到明细表
      let rows = this.$refs.detailTable.getSelected();
      if (!rows.length) {
        return this.$message.error('請選擇數據');
      }
      //獲取回寫到明细表的字段
      let _rows = rows.map((row) => {
        return {
          GoodsId: row.GoodsId,
          GoodsCode: row.GoodsCode,
          GoodsName: row.GoodsName,
          Img: row.Img,
          Specs: row.Specs,
          Price: row.Price
        };
      });
      this.$emit('parentCall', ($parent) => {
        $parent.$refs.detail.rowData.unshift(..._rows);
        this.detailModel = false;
      });
    },
    search() {
      //搜索
      this.$refs.detailTable.load(null, true);
    },
    loadBefore(param, callBack) {
      //批量選擇設置查詢條件
      param.wheres = [
        { name: 'GoodsName', value: this.GoodsName, displayType: 'like' }
      ];
      callBack(true);
    }
  }
};
</script>

<style lang="less" scoped>
.search-form {
  display: flex;
  padding: 10px;
  line-height: 34px;

  button {
    margin-left: 10px;
  }
}
</style>
