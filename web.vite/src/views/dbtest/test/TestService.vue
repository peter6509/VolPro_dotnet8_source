<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/dbtest/test/TestService.js此處編寫
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
    import extend from "@/extension/dbtest/test/TestService.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'Id',
                footer: "Foots",
                cnName: '業務庫',
                name: 'test/TestService',
                url: "/TestService/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"DbName":"","DbContent":""});
            const editFormOptions = ref([[{"title":"業務庫","required":true,"field":"DbName"}],
                              [{"title":"内容","field":"DbContent"}]]);
            const searchFormFields = ref({"DbName":"","DbContent":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"業務庫","field":"DbName","type":"like"},{"title":"内容","field":"DbContent"},{"title":"CreateDate","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'Id',title:'Id',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'DbName',title:'業務庫',type:'string',link:true,width:110,require:true,align:'left',sort:true},
                       {field:'DbContent',title:'内容',type:'string',width:110,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:150,align:'left',sort:true},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:130,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:150,align:'left',sort:true},
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
