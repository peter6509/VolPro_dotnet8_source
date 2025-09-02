<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/system/flow/Sys_WorkFlow.js此處編寫
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
    import extend from "@/extension/sys/flow/Sys_WorkFlow.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'WorkFlow_Id',
                footer: "Foots",
                cnName: '審批流程配置',
                name: 'flow/Sys_WorkFlow',
                url: "/Sys_WorkFlow/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"WorkName":"","WorkTable":"","Remark":""});
            const editFormOptions = ref([[{"title":"流程名稱","required":true,"field":"WorkName"},
                               {"title":"表名","required":true,"field":"WorkTable"},
                               {"title":"備註","field":"Remark"}]]);
            const searchFormFields = ref({"WorkName":"","WorkTable":"","AuditingEdit":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"流程名稱","field":"WorkName"},{"title":"表名","field":"WorkTable"},{"dataKey":"enable","data":[],"title":"同步更新審批業務數據","field":"AuditingEdit","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'WorkFlow_Id',title:'WorkFlow_Id',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'WorkName',title:'流程名稱',type:'string',link:true,width:140,require:true,align:'left',sort:true},
                       {field:'WorkTable',title:'表名',type:'string',width:100,require:true,align:'left'},
                       {field:'WorkTableName',title:'功能菜單',type:'string',width:120,align:'left'},
                       {field:'Weight',title:'權重(相同條件權重大的優先匹配)',type:'int',width:100,align:'left'},
                       {field:'Enable',title:'是否啟用',type:'byte',bind:{ key:'enable',data:[]},width:100,hidden:true,align:'left'},
                       {field:'AuditingEdit',title:'同步更新審批業務數據',type:'int',bind:{ key:'enable',data:[]},width:80,align:'left'},
                       {field:'NodeConfig',title:'節點信息',type:'string',width:110,hidden:true,align:'left'},
                       {field:'LineConfig',title:'連接配置',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:130,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:160,align:'left',sort:true}]);
            const detail = ref({
                cnName: "審批節點配置",
                table: "Sys_WorkFlowStep",
                columns: [{field:'WorkStepFlow_Id',title:'WorkStepFlow_Id',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'WorkFlow_Id',title:'流程主表id',type:'guid',width:110,align:'left',sort:true},
                       {field:'StepId',title:'流程節點Id',type:'string',width:120,align:'left'},
                       {field:'StepName',title:'節點名稱',type:'string',width:110,align:'left'},
                       {field:'StepType',title:'節點類型(1=按用户審批,2=按角色審批)',type:'int',width:110,align:'left'},
                       {field:'StepValue',title:'審批用户id或角色id',type:'string',width:110,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:220,align:'left'},
                       {field:'OrderId',title:'審批順序',type:'int',width:80,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,align:'left'},
                       {field:'Enable',title:'Enable',type:'byte',width:110,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'NextStepIds',title:'下一個審批節點',type:'string',width:220,hidden:true,align:'left'},
                       {field:'ParentId',title:'父级節點',type:'string',width:120,hidden:true,align:'left'},
                       {field:'AuditRefuse',title:'審核未通過(返回上一節點,流程重新開始,流程结束)',type:'int',width:80,hidden:true,align:'left'},
                       {field:'AuditBack',title:'駁回(返回上一節點,流程重新開始,流程结束)',type:'int',width:80,hidden:true,align:'left'},
                       {field:'AuditMethod',title:'審批方式(啟用會簽)',type:'int',width:80,hidden:true,align:'left'},
                       {field:'SendMail',title:'審核後發送郵件通知',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Filters',title:'審核條件',type:'string',width:220,hidden:true,align:'left'},
                       {field:'StepAttrType',title:'節點屬性(start、node、end))',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Weight',title:'權重(相同條件權重大的優先匹配)',type:'int',width:80,align:'left'}],
                sortName: "CreateDate",
                key: "WorkStepFlow_Id"
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
