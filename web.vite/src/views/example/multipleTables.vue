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
    :detail-height="148"
    :detail="detail"
    :details="details"
  >
    <template #header>
      <el-alert
        title="新窗口編輯模式：已支持零代碼自動構建生成一對多、多對多新窗口模式頁面，並支持自定義業務擴展"
        type="warning"
        show-icon
        :closable="false"
      />
    </template>
    <template #content>
      <el-alert
        style="margin-top: 10px; margin-bottom: -10px"
        title="N個明细表：代碼生成器可快速構建明细表,並且不限制明细表數量；或許一周的工作量使用框架最多1小時完成"
        type="success"
        show-icon
        :closable="false"
      />
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
  nextTick,
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
        "SetWorkTimes",
        "WorkTimes",
        "SetDeliveryAmount",
        "DeliveryAmount",
      ].includes(x.field)
    ) {
      x.group = "基礎信息";
    } else if (["img1", "img2", "img3", "img4", "remark"].includes(x.field)) {
      x.group = "供應商資質";
    } else {
      x.group = "供應商信息";
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

nextTick(() => {
  edit.value.getTable("Pm_ControlDetail").rowData.push(
    ...[
      {
        ItemName: "設備費用",
        CurrCostAmount: 1000,
        PreCostAmount: 800,
        Memo: "設備費用...",
        CreateID: 1,
        Creator: "admin",
        CreateDate: "2022-01-01",
        ModifyID: 2,
        Modifier: "admin",
        ModifyDate: "2022-01-05",
      },
      {
        ItemName: "材料費用",
        CurrCostAmount: 1500,
        PreCostAmount: 1200,
        Memo: "材料費用...",
        CreateID: 3,
        Creator: "admin",
        CreateDate: "2022-01-02",
        ModifyID: 4,
        Modifier: "admin",
        ModifyDate: "2022-01-06",
      },
      {
        ItemName: "工時費用",
        CurrCostAmount: 2000,
        PreCostAmount: 1800,
        Memo: "工時費用...",
        CreateID: 5,
        Creator: "admin",
        CreateDate: "2022-01-03",
        ModifyID: 6,
        Modifier: "admin",
        ModifyDate: "2022-01-07",
      },
    ]
  );
});

const clickTest = () => {
  edit.value.getTable("Pm_ControlDetail").rowData.push({});
};
</script>
