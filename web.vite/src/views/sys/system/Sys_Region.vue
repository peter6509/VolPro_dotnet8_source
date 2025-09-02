<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/system/Sys_Region.js此處編寫
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
    import extend from "@/extension/sys/system/Sys_Region.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'id',
                editTable:true ,
                footer: "Foots",
                cnName: '省市區縣',
                name: 'system/Sys_Region',
                newTabEdit: false,
                url: "/Sys_Region/",
                sortName: "id"
            });
            const editFormFields = ref({"code":"","name":"","parentId":"","level":"","mername":"","Lng":"","Lat":""});
            const editFormOptions = ref([[{"title":"編碼","field":"code"},
                               {"title":"名稱","field":"name"},
                               {"title":"上级編碼","field":"parentId","type":"number"},
                               {"title":"级别","field":"level","type":"number"},
                               {"title":"完整地址","field":"mername"},
                               {"title":"經度","field":"Lng","type":"decimal"},
                               {"title":"緯度","field":"Lat","type":"decimal"}]]);
            const searchFormFields = ref({"name":"","level":"","mername":"","pinyin":""});
            const searchFormOptions = ref([[{"title":"名稱","field":"name"},{"title":"级别","field":"level","type":"number"},{"title":"完整地址","field":"mername","type":"like"},{"title":"拼音","field":"pinyin","type":"like"}]]);
            const columns = ref([{field:'id',title:'id',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'code',title:'編碼',type:'string',width:70,edit:{type:''},align:'left',sort:true},
                       {field:'name',title:'名稱',type:'string',width:100,edit:{type:''},align:'left'},
                       {field:'parentId',title:'上级編碼',type:'int',width:70,edit:{type:''},align:'left'},
                       {field:'level',title:'级别',type:'int',width:50,edit:{type:''},align:'left'},
                       {field:'mername',title:'完整地址',type:'string',width:140,edit:{type:''},align:'left'},
                       {field:'Lng',title:'經度',type:'float',width:70,edit:{type:''},align:'left'},
                       {field:'Lat',title:'緯度',type:'float',width:70,edit:{type:''},align:'left'},
                       {field:'pinyin',title:'拼音',type:'string',width:100,align:'left'}]);
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
