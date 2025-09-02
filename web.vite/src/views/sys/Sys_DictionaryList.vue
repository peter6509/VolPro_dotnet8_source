<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/system/Sys_DictionaryList.js此處編寫
 -->
<template>
    <div>
        <view-grid :columns="columns"
                   :detail="detail"
                   :editFormFields="editFormFields"
                   :editFormOptions="editFormOptions"
                   :searchFormFields="searchFormFields"
                   :searchFormOptions="searchFormOptions"
                   :table="table"
                   :extend="extend">
        </view-grid>
    </div>
</template>

<script>
    import extend from "@/extension/sys/Sys_DictionaryList.js";
    var vueParam = {
        data() {
            return {
                table: {
                    key: 'DicList_ID',
                    footer: "Foots",
                    cnName: '字典明细',
                    name: 'Sys_DictionaryList',
                    url: "/Sys_DictionaryList/",
                    sortName: "DicList_ID"
                },
                extend: extend,
                editFormFields: {"DicValue":"","DicName":"","OrderNo":"","Remark":"","Enable":""},
                editFormOptions: [[{"columnType":"string","title":"數據源Value","field":"DicValue","type":"text"},
                               {"columnType":"string","title":"數據源Text","field":"DicName","type":"text"},
                               {"columnType":"int","title":"排序號","field":"OrderNo","type":"text"},
                               {"columnType":"int","title":"備註","field":"Remark","type":"text"},
                               {"columnType":"byte","dataKey":"enable","title":"是否可用","field":"Enable","type":"switch"}]],
                searchFormFields: {},
                searchFormOptions: [],
                columns: [{field:'DicList_ID',title:'DicList_ID',type:'int',width:90,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Dic_ID',title:'數據源ID',type:'int',width:90,readonly:true,align:'left',sortable:true},
                       {field:'DicValue',title:'數據源Value',type:'string',width:90,align:'left'},
                       {field:'DicName',title:'數據源Text',type:'string',width:90,align:'left'},
                       {field:'OrderNo',title:'排序號',type:'int',width:90,align:'left'},
                       {field:'Remark',title:'備註',type:'int',width:90,align:'left'},
                       {field:'Enable',title:'是否可用',type:'byte',bind:{ key:'enable',data:[]},width:90,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:130,readonly:true,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:90,readonly:true,align:'left',sortable:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:90,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:90,align:'left',sortable:true}],
                detail: {
                    cnName:"#detailCnName",
                    columns: [],
                    sortName: "#detailSortName"
                }
            };
        }
    };
    export default vueParam;
</script>
