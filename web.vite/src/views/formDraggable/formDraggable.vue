<template>

  <VolFormDraggable @save="save" :userComponents="userComponents"></VolFormDraggable>
</template>

<script>
// 
import VolFormDraggable from "@/components/basic/VolFormDraggable/index.js";
export default {
  components: {
    VolFormDraggable,
  },
  methods: {
    save(options) {
      this.$Message.success("可以將當前配置保存到數據庫中用於二次維護");
      console.log(JSON.stringify(options))
    },
  },
  data(){
      return{
          userComponents:[]
      }
  },
  created() {
    //收起左側菜單
    this.menu.hide();
  },
};
</script>
<style lang="less" scoped>
</style>