<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/Sys_Dictionary.js此處編寫
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
    import extend from "@/extension/sys/Sys_Dictionary.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'Dic_ID',
                footer: "Foots",
                cnName: '字典數據',
                name: 'Sys_Dictionary',
                newTabEdit: false,
                url: "/Sys_Dictionary/",
                sortName: "Dic_ID"
            });
            const editFormFields = ref({"DicNo":"","DicName":"","ParentId":"","DBServer":"","OrderNo":"","Enable":"","DbSql":"","Remark":""});
            const editFormOptions = ref([[{"title":"字典編號","required":true,"field":"DicNo"},
                               {"title":"字典名稱","required":true,"field":"DicName"},
                               {"title":"父级ID","required":true,"field":"ParentId","type":"number"}],
                              [{"dataKey":"dbServer","data":[],"title":"所在數據庫","field":"DBServer","type":"select"},
                               {"title":"排序號","field":"OrderNo","type":"number"},
                               {"dataKey":"enable","data":[],"title":"是否啟用","required":true,"field":"Enable","type":"select"}],
                              [{"title":"sql語句","field":"DbSql","colSize":8,"type":"textarea"},
                               {"title":"備註","field":"Remark","type":"textarea"}]]);
            const searchFormFields = ref({"DicNo":"","DicName":"","ParentId":"","Enable":"","CreateDate":"","ModifyDate":""});
            const searchFormOptions = ref([[{"title":"字典編號","field":"DicNo"},{"title":"字典名稱","field":"DicName","type":"textarea"},{"title":"父级ID","field":"ParentId","type":"number"}],[{"dataKey":"enable","data":[],"title":"是否啟用","field":"Enable","type":"select"},{"title":"創建時間","field":"CreateDate","type":"datetime"},{"title":"修改時間","field":"ModifyDate","type":"datetime"}]]);
            const columns = ref([{field:'Dic_ID',title:'字典ID',type:'int',width:90,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'DicNo',title:'字典編號',type:'string',width:140,require:true,align:'left',sort:true},
                       {field:'DicName',title:'字典名稱',type:'string',link:true,width:100,require:true,align:'left'},
                       {field:'ParentId',title:'父级ID',type:'int',width:90,require:true,align:'left'},
                       {field:'Config',title:'配置項',type:'string',width:300,hidden:true,align:'left'},
                       {field:'DbSql',title:'sql語句',type:'string',width:200,align:'left'},
                       {field:'DBServer',title:'所在數據庫',type:'string',bind:{ key:'dbServer',data:[]},width:90,hidden:true,align:'left'},
                       {field:'OrderNo',title:'排序號',type:'int',width:90,align:'left',hidden:true},
                       {field:'Remark',title:'備註',type:'string',width:90,align:'left'},
                       {field:'Enable',title:'是否啟用',type:'byte',bind:{ key:'enable',data:[]},width:90,require:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,hidden:true,readonly:true,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:130,readonly:true,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,readonly:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:130,readonly:true,align:'left',sort:true}]);
            const detail = ref(  {
                    cnName: '字典明细',
                    table: 'Sys_DictionaryList',
                    columns: [{field:'DicList_ID',title:'DicList_ID',type:'int',width:90,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Dic_ID',title:'數據源ID',type:'int',width:90,readonly:true,align:'left',sort:true},
                       {field:'DicValue',title:'數據源Value',type:'string',width:90,edit:{type:'text'},align:'left'},
                       {field:'DicName',title:'數據源Text',type:'string',width:90,edit:{type:'text'},align:'left'},
                       {field:'OrderNo',title:'排序號',type:'int',width:90,edit:{type:'text'},align:'left'},
                       {field:'Remark',title:'備註',type:'string',width:90,edit:{type:'text'},align:'left'},
                       {field:'Enable',title:'是否可用',type:'byte',bind:{ key:'enable',data:[]},width:70,edit:{type:'switch'},align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:90,readonly:true,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:140,readonly:true,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:90,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:140,align:'left',sort:true}],
                    sortName: 'DicList_ID',
                    key: 'DicList_ID',
                    buttons:[],
                    delKeys:[]
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
