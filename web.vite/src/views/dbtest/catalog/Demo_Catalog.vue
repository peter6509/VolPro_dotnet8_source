<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/dbtest/catalog/Demo_Catalog.js此處編寫
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
    import extend from "@/extension/dbtest/catalog/Demo_Catalog.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'CatalogId',
                footer: "Foots",
                cnName: '商品分類',
                name: 'catalog/Demo_Catalog',
                url: "/Demo_Catalog/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"CatalogCode":"","CatalogName":"","ParentId":[],"Enable":"","Remark":"","Img":""});
            const editFormOptions = ref([[{"title":"分類編號","required":true,"field":"CatalogCode"},
                               {"title":"分類名稱","required":true,"field":"CatalogName"}],
                              [{"dataKey":"分類级聯","data":[],"title":"上级分類","field":"ParentId","type":"cascader"},
                               {"dataKey":"商品分類可用","data":[],"title":"是否可用","field":"Enable","type":"radio"}],
                              [{"title":"備註","field":"Remark","colSize":12,"type":"textarea"}],
                              [{"title":"分類圖片","field":"Img","type":"img"}]]);
            const searchFormFields = ref({"CatalogCode":"","CatalogName":"","Enable":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"分類編號","field":"CatalogCode"},{"title":"分類名稱","field":"CatalogName","type":"like"},{"dataKey":"商品分類可用","data":[],"title":"是否可用","field":"Enable","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'CatalogId',title:'商品分類',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'CatalogCode',title:'分類編號',type:'string',sort:true,width:90,require:true,align:'left',sort:true},
                       {field:'CatalogName',title:'分類名稱',type:'string',link:true,width:100,require:true,align:'left'},
                       {field:'ParentId',title:'上级分類',type:'guid',bind:{ key:'分類级聯',data:[]},sort:true,width:110,align:'left'},
                       {field:'Img',title:'分類圖片',type:'img',width:90,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',bind:{ key:'商品分類可用',data:[]},sort:true,width:110,align:'left'},
                       {field:'Remark',title:'備註',type:'string',sort:true,width:120,align:'left'},
                       {field:'CreateID',title:'創建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:110,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:110,hidden:true,align:'left',sort:true}]);
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
