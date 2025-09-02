<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/system/Sys_ReportOptions.js此處編寫
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
    import extend from "@/extension/sys/system/Sys_ReportOptions.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ReportOptionsId',
                footer: "Foots",
                cnName: '報表模板',
                name: 'system/Sys_ReportOptions',
                newTabEdit: false,
                url: "/Sys_ReportOptions/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"ReportName":"","ReportCode":"","DbService":"","Options":"","FilePath":""});
            const editFormOptions = ref([[{"title":"報表名稱","required":true,"field":"ReportName"}],
                              [{"title":"報表編碼","required":true,"field":"ReportCode","disabled":true}],
                              [{"dataKey":"dbServer","data":[],"title":"所在數據庫","field":"DbService","type":"select"}],
                              [{"title":"數據源sql","field":"Options","type":"textarea"}],
                              [{"title":"模板文件","required":true,"field":"FilePath","type":"file"}]]);
            const searchFormFields = ref({"ReportName":"","ReportCode":"","DbService":""});
            const searchFormOptions = ref([[{"title":"報表名稱","field":"ReportName","type":"like"},{"title":"報表編碼","field":"ReportCode"},{"dataKey":"dbServer","data":[],"title":"所在數據庫","field":"DbService","type":"select"}]]);
            const columns = ref([{field:'ReportOptionsId',title:'ReportOptionsId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'ReportName',title:'報表名稱',type:'string',link:true,width:110,require:true,align:'left'},
                       {field:'ReportCode',title:'報表編碼',type:'string',width:140,readonly:true,require:true,align:'left'},
                       {field:'DbService',title:'所在數據庫',type:'string',bind:{ key:'dbServer',data:[]},width:130,align:'left'},
                       {field:'ReportType',title:'報表類型',type:'string',width:120,hidden:true,align:'left'},
                       {field:'ParentId',title:'父级id',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'FilePath',title:'模板文件',type:'string',width:100,require:true,align:'left'},
                       {field:'Options',title:'數據源sql',type:'string',width:100,hidden:true,align:'left'},
                       {field:'OptionsText',title:'OptionsText',type:'string',width:150,hidden:true,align:'left'},
                       {field:'Enable',title:'發布狀態',type:'int',width:100,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'DbServiceId',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'UserId',title:'UserId',type:'int',width:110,hidden:true,align:'left'},
                       {field:'TenancyId',title:'租户id',type:'string',width:120,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:150,align:'left'}]);
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
