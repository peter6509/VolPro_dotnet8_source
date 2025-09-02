<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/system/Sys_Department.js此處編寫
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
    import extend from "@/extension/sys/system/Sys_Department.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'DepartmentId',
                footer: "Foots",
                cnName: '组織架構',
                name: 'system/Sys_Department',
                url: "/Sys_Department/",
                sortName: "DepartmentName"
            });
            const editFormFields = ref({"DepartmentName":"","DepartmentCode":"","ParentId":[],"DepartmentType":"","Enable":"","Remark":""});
            const editFormOptions = ref([[{"title":"名稱","required":true,"field":"DepartmentName"},
                               {"title":"編號","field":"DepartmentCode"}],
                              [{"dataKey":"部門级聯","data":[],"title":"上级组織","field":"ParentId","type":"cascader"},
                               {"dataKey":"组織類型","data":[],"title":"類型","field":"DepartmentType","type":"radio"}],
                              [{"dataKey":"enable","data":[],"title":"是否可用","field":"Enable","type":"select"},
                               {"title":"備註","field":"Remark","type":"text"}]]);
            const searchFormFields = ref({"DepartmentName":"","DepartmentCode":"","Enable":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"名稱","field":"DepartmentName","type":"like"},{"title":"編號","field":"DepartmentCode","type":"like"},{"dataKey":"enable","data":[],"title":"是否可用","field":"Enable","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'DepartmentId',title:'DepartmentId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'DepartmentName',title:'名稱',type:'string',link:true,width:150,require:true,align:'left',sort:true},
                       {field:'ParentId',title:'上级组織',type:'guid',bind:{ key:'部門级聯',data:[]},width:110,hidden:true,align:'left'},
                       {field:'DepartmentCode',title:'編號',type:'string',width:90,align:'left'},
                       {field:'DepartmentType',title:'類型',type:'string',bind:{ key:'组織類型',data:[]},width:80,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',bind:{ key:'enable',data:[]},width:80,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:100,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:150,align:'left',sort:true},
                       {field:'DbServiceId',title:'所屬數據庫',type:'guid',width:110,hidden:true,align:'left'}]);
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
