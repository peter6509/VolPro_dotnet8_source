<template>
  <div
    ref="node"
    class="node-item"
    :style="nodeContainerStyle"
    @click="clickNode"
    @mouseup="changeNodeSite"
    :class="nodeContainerClass"
  >
    <!-- 最左側的那條竖線 -->
    <div class="ef-node-left"></div>
    <!-- 節點類型的圖標 -->
    <div class="ef-node-left-ico flow-node-drag">
      <i :class="nodeIcoClass"></i>
    </div>
    <!-- 節點名稱 -->
    <div class="ef-node-text" :show-overflow-tooltip="true">
      {{ node.name }}
    </div>
    <i
      @click.stop="delNode"
      v-if="node.type == 'node'"
      style="display: none"
      class="el-icon-delete"
    ></i>
    <!-- 節點狀態圖標 -->
    <div class="ef-node-right-ico">
      <i
        class="el-icon-circle-check el-node-state-success"
        v-show="node.state === 'success'"
      ></i>
      <i
        class="el-icon-circle-close el-node-state-error"
        v-show="node.state === 'error'"
      ></i>
      <i
        class="el-icon-warning-outline el-node-state-warning"
        v-show="node.state === 'warning'"
      ></i>
      <i
        class="el-icon-loading el-node-state-running"
        v-show="node.state === 'running'"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    activeElement: Object,
  },
  data() {
    return {};
  },
  computed: {
    nodeContainerClass() {
      return {
        "ef-node-container": true,
        "ef-node-active":
          this.activeElement.type == "node"
            ? this.activeElement.nodeId === this.node.id
            : false,
      };
    },
    // 節點容器樣式
    nodeContainerStyle() {
      return {
        top: this.node.top,
        left: this.node.left,
      };
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.ico] = true;
      // 添加该class可以推拽連線出來，viewOnly 可以控制節點是否運行編輯
      nodeIcoClass["flow-node-drag"] = this.node.viewOnly ? false : true;
      return nodeIcoClass;
    },
  },
  methods: {
    // 點擊節點
    clickNode() {
      this.$emit("clickNode", this.node.id);
    },
    // 鼠標移動後抬起
    changeNodeSite() {
      // 避免抖動
      if (
        this.node.left == this.$refs.node.style.left &&
        this.node.top == this.$refs.node.style.top
      ) {
        return;
      }
      this.$emit("changeNodeSite", {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top,
      });
    },
    delNode() {
      this.$emit("delNode");
    },
  },
};
</script>
<style scoped lang="less">
@import "./index.css";
/* .node-item{
    position: relative;
} */
.node-item:hover .el-icon-delete {
  display: inline-block !important;
}

.el-icon-delete {
  cursor: pointer;
  position: relative;
  top: -18px;
  padding-left: 5px;
  right: -16px;
  color: #f61313;
  height: 20px;
}
</style>
