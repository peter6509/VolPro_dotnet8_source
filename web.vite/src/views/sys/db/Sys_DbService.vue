<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/db/Sys_DbService.js此處編寫
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
    import extend from "@/extension/sys/db/Sys_DbService.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'DbServiceId',
                footer: "Foots",
                cnName: '租户管理',
                name: 'db/Sys_DbService',
                url: "/Sys_DbService/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"DbServiceName":"","GroupId":"","DbIpAddress":"","DatabaseName":"","UserId":"","Pwd":"","PhoneNo":"","Address":"","Remark":""});
            const editFormOptions = ref([[{"title":"租户名稱","required":true,"field":"DbServiceName"},
                               {"dataKey":"集團","data":[],"title":"所屬集團","field":"GroupId","type":"select"}],
                              [{"title":" 數據庫IP","field":"DbIpAddress"},
                               {"title":"數據庫名","field":"DatabaseName"}],
                              [{"title":"帳號","field":"UserId"},
                               {"title":"密碼","field":"Pwd"}],
                              [{"title":"手機號","field":"PhoneNo"},
                               {"title":"地址","field":"Address"}],
                              [{"title":"備註","field":"Remark","colSize":12,"type":"textarea"}]]);
            const searchFormFields = ref({"DbServiceName":"","DbIpAddress":"","PhoneNo":"","Address":""});
            const searchFormOptions = ref([[{"title":"租户名稱","field":"DbServiceName","type":"like"},{"title":" 數據庫IP","field":"DbIpAddress","type":"like"},{"title":"手機號","field":"PhoneNo"},{"title":"地址","field":"Address","type":"like"}]]);
            const columns = ref([{field:'DbServiceId',title:'DbServiceId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'DbServiceName',title:'租户名稱',type:'string',link:true,width:150,require:true,align:'left',sort:true},
                       {field:'GroupId',title:'所屬集團',type:'guid',bind:{ key:'集團',data:[]},width:170,align:'left'},
                       {field:'DbIpAddress',title:' 數據庫IP',type:'string',width:110,align:'left'},
                       {field:'DatabaseName',title:'數據庫名',type:'string',width:100,align:'left'},
                       {field:'UserId',title:'帳號',type:'string',width:100,hidden:true,align:'left'},
                       {field:'PhoneNo',title:'手機號',type:'string',width:130,align:'left'},
                       {field:'Address',title:'地址',type:'string',width:140,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',width:110,hidden:true,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:150,hidden:true,align:'left',sort:true}]);
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
