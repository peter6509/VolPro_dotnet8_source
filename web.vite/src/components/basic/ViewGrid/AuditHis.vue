<template>
  <vol-table
    :tableData="tableData"
    :columns="columns"
    :height="411"
    :pagination-hide="true"
    :load-key="false"
    :text-inline="false"
    :ck="false"
  ></vol-table>
</template>
<script>
import VolTable from '@/components/basic/VolTable.vue';
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance
} from 'vue';
export default defineComponent({
  components: {
    VolTable
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  setup() {
    const columns = reactive([
      { title: '節點', field: 'stepName' },
      { title: '審批人', field: 'auditor' },
      { title: '審批结果', field: 'auditStatus' },
      { title: '審批時間', field: 'auditDate',width:150 },
      { title: '備註', field: 'remark' }
    ]);
    return {
        columns
    }
  }
});
</script>
