<template>
  <el-alert :closable="false" style="margin-top: -5px;margin-bottom: 5px; height: 31px;line-height: 16px;" type="success" title="">
    一對多(支持多個二级明细與三级明细表)零代碼全自動生成; (上面表單可設置分组顯示,文檔：前端開發文檔->編輯彈出框表單分组2)...
  </el-alert>
</template>
<script setup>

import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance
} from 'vue';
const val = ref('')

</script>

<style lang="less" scoped></style>
