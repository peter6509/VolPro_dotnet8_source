<template>
  <vol-edit
    ref="edit"
    labelPosition="left"
    :keyField="key"
    :tableName="tableName"
    :tableCNName="tableCNName"
    :labelWidth="labelWidth"
    :formFields="editFormFields"
    :formOptions="editFormOptions"
    :detail-height="0"
    :detail="detail"
    :details="details"
  >
    <template #header>
      <!-- <div><el-button @click="clickTest">111</el-button></div> -->
    </template>
  </vol-edit>
</template>
<script lang="jsx">
export default { name: "#table_edit" };
</script>
<script setup lang="jsx">
//參數配置及示例見：http://doc.volcore.xyz/viewGrid/edit.html
import editOptions from "./options.js";
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  defineEmits,
  defineExpose,
  defineProps,
} from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
//發起請求proxy.http.get/post
//消息提示proxy.$message.success()

//這裡表單與明细表參數，具體信息看options.js裡面
const {
  key,
  tableName,
  tableCNName,
  editFormFields,
  editFormOptions,
  detail,
  details,
} = reactive(editOptions());
editFormOptions.forEach((ops) => {
  ops.forEach((x) => {
    if (
      [
        "ProjectCode",
        "ProjectName",
        "FacilityId",
        "FacilityNum",
        "SetPurchaseAmount",
        "PurchaseAmount",
        "SetMaterialAmount",
        "MaterialAmount",
      ].includes(x.field)
    ) {
      x.group = "基礎信息";
    } else {
      x.group = "其他信息";
    }
  });
});

const route = useRoute();
//是否新建操作
let isAdd = !!route.query.id;

//vol-edit组件
const edit = ref(null);

//表單標籤文字顯示寬度
const labelWidth = 90;

const clickTest = () => {};
</script>
