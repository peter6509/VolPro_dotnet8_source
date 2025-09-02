<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/dbtest/goods/Demo_Goods.js此處編寫
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
    import extend from "@/extension/dbtest/goods/Demo_Goods.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'GoodsId',
                footer: "Foots",
                cnName: '商品信息',
                name: 'goods/Demo_Goods',
                newTabEdit: true,
                url: "/Demo_Goods/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"GoodsName":"","CatalogId":[],"GoodsCode":"","Price":"","Remark":"","Img":""});
            const editFormOptions = ref([[{"title":"商品名稱","required":true,"field":"GoodsName","type":"text"}],
                              [{"dataKey":"分類级聯","data":[],"title":"所屬分類","field":"CatalogId","type":"cascader"}],
                              [{"title":"商品編號","required":true,"field":"GoodsCode","type":"text"}],
                              [{"title":"單價","required":true,"field":"Price","type":"decimal"}],
                              [{"title":"備註","field":"Remark","colSize":12,"type":"textarea"}],
                              [{"title":"商品圖片","field":"Img","type":"img"}]]);
            const searchFormFields = ref({"GoodsName":"","CatalogId":[],"GoodsCode":""});
            const searchFormOptions = ref([[{"title":"商品名稱","field":"GoodsName","type":"like"},{"dataKey":"分類级聯","data":[],"title":"所屬分類","field":"CatalogId","type":"cascader"},{"title":"商品編號","field":"GoodsCode"}]]);
            const columns = ref([{field:'GoodsId',title:'商品ID',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'GoodsName',title:'商品名稱',type:'string',link:true,width:120,require:true,align:'left'},
                       {field:'CatalogId',title:'分類',type:'guid',bind:{ key:'分類级聯',data:[]},width:70,align:'left'},
                       {field:'GoodsCode',title:'商品編號',type:'string',width:100,require:true,align:'left'},
                       {field:'Img',title:'商品圖片',type:'img',width:70,align:'left'},
                       {field:'Specs',title:'規格',type:'string',width:60,align:'left'},
                       {field:'Price',title:'單價',type:'decimal',sort:true,width:70,require:true,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',bind:{ key:'enable',data:[]},sort:true,width:90,align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:80,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:120,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'}]);
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
