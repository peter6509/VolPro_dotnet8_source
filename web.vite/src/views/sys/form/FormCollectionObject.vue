<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/system/form/FormCollection.js此處編寫
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
    import extend from "@/extension/sys/form/FormCollectionObject.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'FormCollectionId',
                footer: "Foots",
                cnName: '數據采集',
                name: 'form/FormCollectionObject',
                url: "/FormCollectionObject/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"Title":"","FormData":""});
            const editFormOptions = ref([[{"title":"標題","field":"Title"},
                               {"title":"表單數據","field":"FormData"}]]);
            const searchFormFields = ref({"Title":"","Creator":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"標題","field":"Title","type":"like"},{"title":"提交人","field":"Creator","type":"like"},{"title":"提交時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'FormCollectionId',title:'FormCollectionId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'FormId',title:'表單ID',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'Title',title:'標題',type:'string',width:110,align:'left',sort:true},
                       {field:'FormData',title:'表單數據',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Creator',title:'提交人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'提交時間',type:'datetime',width:145,align:'left',sort:true},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'}]);
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
