<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/dbtest/product/Demo_ProductColor.jsx此處編寫
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
    import extend from "@/extension/dbtest/product/Demo_ProductColor.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ProductColorId',
                footer: "Foots",
                cnName: '產品顏色',
                name: 'product/Demo_ProductColor',
                newTabEdit: false,
                url: "/Demo_ProductColor/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"Color":"","Qty":"","Unit":"","Remark":"","Img":""});
            const editFormOptions = ref([[{"dataKey":"顏色","data":[],"title":"顏色","required":true,"field":"Color","type":"radio"}],
                              [{"title":"數量","required":true,"field":"Qty"}],
                              [{"dataKey":"單位","data":[],"title":"單位","required":true,"field":"Unit","type":"select"}],
                              [{"title":"備註","field":"Remark"}],
                              [{"title":"圖片","required":true,"field":"Img","type":"img"}]]);
            const searchFormFields = ref({"Color":"","Qty":"","Unit":"","CreateDate":""});
            const searchFormOptions = ref([[{"dataKey":"顏色","data":[],"title":"顏色","field":"Color","type":"select"},{"title":"數量","field":"Qty"},{"dataKey":"單位","data":[],"title":"單位","field":"Unit","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'ProductColorId',title:'ProductColorId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'ProductId',title:'商品id',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'Color',title:'顏色',type:'string',bind:{ key:'顏色',data:[]},width:100,require:true,align:'left'},
                       {field:'Qty',title:'數量',type:'string',link:true,width:90,require:true,align:'left'},
                       {field:'Unit',title:'單位',type:'string',bind:{ key:'單位',data:[]},width:90,require:true,align:'left'},
                       {field:'Img',title:'圖片',type:'img',width:90,require:true,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:130,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:110,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:110,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:200,hidden:true,align:'left'}]);
            const detail = ref(  {
                    cnName: '產品顏色明细',
                    table: 'Demo_ProductColorSub',
                    columns: [{field:'ProductColorSubId',title:'ProductColorSubId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'ProductColorId',title:'ProductColorId',type:'guid',width:110,hidden:true,align:'left'},
                       {field:'FactoryLocation',title:'FactoryLocation',type:'string',width:120,edit:{type:''},require:true,align:'left'},
                       {field:'Manufacturer',title:'Manufacturer',type:'string',width:120,edit:{type:''},require:true,align:'left'},
                       {field:'ProductionDate',title:'ProductionDate',type:'datetime',width:150,edit:{type:''},align:'left'},
                       {field:'Quantity',title:'Quantity',type:'int',width:80,edit:{type:''},require:true,align:'left'},
                       {field:'Price',title:'Price',type:'decimal',width:110,edit:{type:''},require:true,align:'left'},
                       {field:'Remark',title:'Remark',type:'string',width:220,edit:{type:''},align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:150,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:150,hidden:true,align:'left'}],
                    sortName: 'CreateDate',
                    key: 'ProductColorSubId'
                                            });
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
