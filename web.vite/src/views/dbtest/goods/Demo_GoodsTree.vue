<template>
  <div class="goods-tree">
    <!-- 左邊樹结構 -->
    <div class="tree-left">
      <div class="tree-left-title">商品分類</div>
      <el-scrollbar style="flex:1;border-right: 1px solid #eee;">
        <!-- el-tree文檔https://element-plus.gitee.io/zh-CN/component/tree.html#%E6%96%B9%E6%B3%95 -->
        <el-tree
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="nodeClick"
        />
      </el-scrollbar>
    </div>
    <!-- 右邊商品信息table數據 -->
    <div class="tree-right">
      <goods ref="table"></goods>
    </div>
  </div>
</template>

<script>
import goods from './Demo_Goods.vue';
export default {
  components: {
    goods
  },
  data() {
    return {
      data: [],
      orginData: [], //原始數據
      defaultProps: {
        children: 'children',
        label: 'name' //樹形结構顯示名稱的字段
      },
      defaultExpandedKeys: [] //默認展開的tree節點
    };
  },
  methods: {
    nodeClick(data) {//左側樹點擊事件
      let ids = [];
      //獲取分類的子節點
      //左邊樹節點的選有子節點，用於查詢數據
      this.getAllChildrenId(data, ids);

      //獲取所有的父節點
      //左側樹選中節點的所有父節點,用於新建時設置级聯的默認值
      let nodes = this.base.getTreeAllParent(data.id, this.orginData);

      console.log(nodes);
      //獲取節點的id
      nodes = nodes.map((m) => {
        return m.id;
      });

      //調用右邊商品信息的查詢(見代碼Demo_Goods.js)
      this.$refs.table.$refs.grid.nodeClick(ids,nodes);
    },
    getAllChildrenId(data, ids) {
      //獲取分類的子節點
      ids.push(data.id);
      if (!data.children || !data.children.length) {
        return;
      }
      data.children.forEach((x) => {
        ids.push(x.id);
        this.getAllChildrenId(x, ids);
      });
    }
  },
  created() {
    //從商品Demo_CatalogController加載左邊tree數據
    this.http.get('api/Demo_Catalog/getList').then((result) => {
      //記錄原始數據
      this.orginData = result;
      //將返回的數據遞归轉換為tree结構，文檔：http://v2.volcore.xyz/document/vueDev【數组對象轉換為tree】
      this.data = this.base.convertTree(result, (node, data, isRoot) => {});
      //商品分類有數據時加載右邊商品信息
      if (this.data.length) {
        //默認展開經一個樹節點
        this.defaultExpandedKeys = [this.data[0].id];
        //調用右邊商品信息的查詢
        this.$nextTick(() => {
          this.nodeClick(this.data[0]);
        });
      }
    });
  }
};
</script>
<style lang="less" scoped>
.goods-tree {
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  .tree-left {
    display: flex;
    flex-direction: column;
    width: 200px;
    .tree-left-title {
      line-height: 25px;
      font-size: 15px;
      background: rgba(102, 177, 255, 0.058823529411764705);
      padding: 6px 16px;
      border: 1px solid #ececec;
    }
  }
  .tree-right {
    flex: 1;
    width: 0;
  }
}
</style>
