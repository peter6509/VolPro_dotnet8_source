<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/system/Sys_Log.js此處編寫
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
    import extend from "@/extension/sys/Sys_Log.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'Id',
                footer: "Foots",
                cnName: '系统日誌',
                name: 'Sys_Log',
                url: "/Sys_Log/",
                sortName: "Id"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({"BeginDate":"","Url":"","LogType":[],"Success":[],"UserIP":"","ServiceIP":"","Role_Id":""});
            const searchFormOptions = ref([[{"title":"請求地址","field":"Url","type":"text"},{"title":"用户IP","field":"UserIP","type":"text"},{"title":"服務器IP","field":"ServiceIP","type":"text"}],[{"title":"開始時間","field":"BeginDate","type":"datetime"},{"dataKey":"restatus","data":[],"title":"響應狀態","field":"Success","type":"selectList"},{"dataKey":"roles","data":[],"title":"角色ID","field":"Role_Id","type":"select"}],[{"dataKey":"log","data":[],"title":"日誌類型","field":"LogType","colSize":12,"type":"checkbox"}]]);
            const columns = ref([{field:'Id',title:'Id',type:'int',width:90,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'BeginDate',title:'開始時間',type:'datetime',width:140,align:'left',sortable:true},
                       {field:'UserName',title:'用户名稱',type:'string',width:90,align:'left'},
                       {field:'Url',title:'請求地址',type:'string',width:110,align:'left'},
                       {field:'LogType',title:'日誌類型',type:'string',bind:{ key:'log',data:[]},width:80,align:'left'},
                       {field:'Success',title:'響應狀態',type:'int',bind:{ key:'restatus',data:[]},width:80,align:'left'},
                       {field:'ElapsedTime',title:'時長',type:'int',width:60,align:'left'},
                       {field:'RequestParameter',title:'請求參數',type:'string',width:70,align:'left'},
                       {field:'ResponseParameter',title:'響應參數',type:'string',width:70,align:'left'},
                       {field:'ExceptionInfo',title:'異常信息',type:'string',width:70,align:'left'},
                       {field:'UserIP',title:'用户IP',type:'string',width:90,align:'left'},
                       {field:'ServiceIP',title:'服務器IP',type:'string',width:90,hidden:true,align:'left'},
                       {field:'BrowserType',title:'瀏覽器類型',type:'string',width:90,align:'left'},
                       {field:'User_Id',title:'用户ID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Role_Id',title:'角色ID',type:'int',bind:{ key:'roles',data:[]},width:90,hidden:true,align:'left'},
                       {field:'EndDate',title:'结束時間',type:'datetime',width:150,hidden:true,align:'left',sortable:true}]);
            const detail = ref({
                cnName: "#detailCnName",
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
