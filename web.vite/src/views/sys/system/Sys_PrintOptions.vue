<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/system/Sys_PrintOptions.js此處編寫
 -->
<template>
    <view-grid ref="grid"
               :columns="columns"
               :detail="detail"
               :details="details"
               :editFormFields="editFormFields"
               :editFormOptions="editFormOptions"
               :searchFormFields="searchFormFields"
               :searchFormOptions="searchFormOptions"
               :table="table"
               :extend="extend">
    </view-grid>
</template>
<script>
    import extend from "@/extension/sys/system/Sys_PrintOptions.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'PrintOptionsId',
                footer: "Foots",
                cnName: '打印管理',
                name: 'system/Sys_PrintOptions',
                newTabEdit: false,
                url: "/Sys_PrintOptions/",
                sortName: "TableName,CreateDate"
            });
            const editFormFields = ref({"TableName":"","CustomName":"",Html:""});
            const editFormOptions = ref([[{"title":"打印模塊","required":true,"field":"TableName"}],
                              [{"title":"模板名稱","required":true,"field":"CustomName"}],
                              [{"title":"回調地址",placeholder:"打印成功/失敗後回調接口","required":false,"field":"Html"}]]);
            const searchFormFields = ref({"CustomName":"","TableName":"","CreateDate":"","Creator":""});
            const searchFormOptions = ref([[{"title":"打印模塊","field":"TableName"},{"title":"模板名稱","field":"CustomName"},{"title":"創建時間","field":"CreateDate","type":"datetime"},{"title":"創建人","field":"Creator","type":"like"}]]);
            const columns = ref([{field:'PrintOptionsId',title:'PrintOptionsId',type:'guid',width:110,hidden:true,require:true,align:'left'},
                       {field:'CustomName',title:'模板名稱',type:'string',link:true,width:150,require:true,align:'left',sort:true},
                       {field:'TableName',title:'打印模塊',type:'string',width:120,hidden:true,require:true,align:'left'},
                       {field:'TableCNName',title:'打印模塊名稱',type:'string',width:120,align:'left'},
                       {field:'Options',title:'參數',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Html',title:'Html',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Enable',title:'Enable',type:'int',width:110,hidden:true,align:'left'},
                       {field:'DbService',title:'DbService',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'UserId',title:'UserId',type:'int',width:110,hidden:true,align:'left'},
                       {field:'TenancyId',title:'TenancyId',type:'string',width:120,hidden:true,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:150,align:'left',sort:true}]);
            const detail = ref({columns:[]});
            const details = ref([]);
            return {
                table,
                extend,
                editFormFields,
                editFormOptions,
                searchFormFields,
                searchFormOptions,
                columns,
                detail,
                details
            };
        },
    });
</script>
