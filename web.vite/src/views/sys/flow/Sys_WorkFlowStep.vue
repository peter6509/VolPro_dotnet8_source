<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/system/flow/Sys_WorkFlowStep.js此處編寫
 -->
<template>
    <view-grid ref="grid"
               :columns="columns"
               :detail="detail"
               :editFormFields="editFormFields"
               :editFormOptions="editFormOptions"
               :searchFormFields="searchFormFields"
               :searchFormOptions="searchFormOptions"
               :table="table"
               :extend="extend">
    </view-grid>
</template>
<script>
    import extend from "@/extension/sys/flow/Sys_WorkFlowStep.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'WorkStepFlow_Id',
                footer: "Foots",
                cnName: '審批節點配置',
                name: 'flow/Sys_WorkFlowStep',
                url: "/Sys_WorkFlowStep/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'WorkStepFlow_Id',title:'WorkStepFlow_Id',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'WorkFlow_Id',title:'流程主表id',type:'guid',width:110,align:'left',sort:true},
                       {field:'StepId',title:'流程節點Id',type:'string',width:120,align:'left'},
                       {field:'StepName',title:'節點名稱',type:'string',width:110,align:'left'},
                       {field:'StepType',title:'節點類型(1=按用户審批,2=按角色審批)',type:'int',width:110,align:'left'},
                       {field:'StepValue',title:'審批用户id或角色id',type:'int',width:110,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:220,align:'left'},
                       {field:'OrderId',title:'審批順序',type:'int',width:80,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'}]);
            const detail = ref({
                cnName: "#detailCnName",
                table: "#detailTable",
                columns: [],
                sortName: "",
                key: ""
            });
            return {
                table,
                extend,
                editFormFields,
                editFormOptions,
                searchFormFields,
                searchFormOptions,
                columns,
                detail,
            };
        },
    });
</script>
