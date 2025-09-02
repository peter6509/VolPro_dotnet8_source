<template>
  <vol-box
    :lazy="true"
    v-model="model"
    title="執行日誌"
    :width="1200"
    :padding="0"
  >
   <div style="padding-bottom: 15px;"> <QuartzLog ref="log"></QuartzLog></div>
    <template #footer>
      <div>
        <el-button type="default" size="mini" @click="model = false"
          >關閉</el-button
        >
      </div></template
    >
  </vol-box>
  <el-alert style="margin-bottom:10px;" :show-icon="false" type="success">
    定時任務只有發布後才會運行(本地不會執行)<a
      style="color:#2d8cf0;margin-left:20px;"
      target="blank"
      href="http://v2.volcore.xyz/document/netCoreDev"
      >查看配置文檔</a
    >
    <a
      style="color:#2d8cf0;margin-left:20px;"
      target="blank"
      href="http://v2.volcore.xyz/document/log"
      >查看更新方式</a
    >
  </el-alert>
</template>
<script>
import VolBox from '@/components/basic/VolBox.vue';
import QuartzLog from '@/views/sys/quartz/Sys_QuartzLog';
//這裡使用的vue2語法，也可以寫成vue3語法
export default {
  components: { 'vol-box': VolBox, QuartzLog },
  methods: {},
  data() {
    return {
      model: false
    };
  },
  methods: {
    open() {
      this.model = true;
      this.$nextTick(() => {
        this.$refs.log.$refs.grid.search();
      });
    }
  }
};
</script>
