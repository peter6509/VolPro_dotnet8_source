<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/system/Sys_Post.js此處編寫
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
    import extend from "@/extension/sys/system/Sys_Post.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'PostId',
                footer: "Foots",
                cnName: '崗位管理',
                name: 'system/Sys_Post',
                newTabEdit: false,
                url: "/Sys_Post/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"PostName":"","PostCode":"","ParentId":[],"Enable":"","Remark":""});
            const editFormOptions = ref([[{"title":"崗位名稱","required":true,"field":"PostName"}],
                              [{"title":"崗位編號","field":"PostCode"}],
                              [{"dataKey":"崗位","data":[],"title":"上级崗位","field":"ParentId","type":"cascader"}],
                              [{"dataKey":"enable","data":[],"title":"是否可用","field":"Enable","type":"radio"}],
                              [{"title":"備註","field":"Remark","type":"textarea"}]]);
            const searchFormFields = ref({"PostName":"","PostCode":"","Enable":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"崗位名稱","field":"PostName","type":"like"},{"title":"崗位編號","field":"PostCode","type":"like"},{"dataKey":"enable","data":[],"title":"是否可用","field":"Enable","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'PostId',title:'PostId',type:'string',width:120,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'PostName',title:'崗位名稱',type:'string',link:true,width:130,require:true,align:'left'},
                       {field:'PostCode',title:'崗位編號',type:'string',width:100,align:'left'},
                       {field:'ParentId',title:'上级崗位',type:'string',bind:{ key:'崗位',data:[]},width:120,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'DbServiceId',type:'string',width:120,hidden:true,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',bind:{ key:'enable',data:[]},width:60,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:120,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:120,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:90,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:120,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:120,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:90,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:120,align:'left'}]);
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
