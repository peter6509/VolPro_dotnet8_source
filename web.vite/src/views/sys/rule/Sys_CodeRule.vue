<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代碼由框架生成,任何更改都可能導致被代碼生成器覆蓋
 *業務請在@/extension/sys/rule/Sys_CodeRule.jsx此處編寫
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
    import extend from "@/extension/sys/rule/Sys_CodeRule.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'CodeRuleId',
                footer: "Foots",
                cnName: '單據編碼',
                name: 'rule/Sys_CodeRule',
                newTabEdit: false,
                url: "/Sys_CodeRule/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"TableName":"","Name":"","Field":"","OrderFiled":"","PrefixCode":"","RuleType":"","ValueLen":"","RuleIncremental":"","Code":"","ConcatenationSymbol":""});
            const editFormOptions = ref([[{"title":"業務名稱","field":"TableName"},
                               {"title":"規則名稱","required":true,"field":"Name"}],
                              [{"title":"單據字段","field":"Field"},
                               {"title":"日期排序字段","field":"OrderFiled"}],
                              [{"title":"前缀","field":"PrefixCode"},
                               {"title":"規則類型","required":true,"field":"RuleType"}],
                              [{"title":"編號位數","required":true,"field":"ValueLen","type":"number"},
                               {"title":"增長類型","field":"RuleIncremental"}],
                              [{"title":"連接符號","field":"ConcatenationSymbol"},
                               {"title":"編碼預覽","field":"Code","disabled":true}]]);
            const searchFormFields = ref({"TableCNName":"","Name":"","Code":""});
            const searchFormOptions = ref([[{"title":"業務名稱","field":"TableCNName","type":"like"},{"title":"規則名稱","field":"Name","type":"like"},{"title":"編碼預覽","field":"Code"}]]);
            const columns = ref([{field:'CodeRuleId',title:'CodeRuleId',type:'string',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'TableName',title:'業務名稱',type:'string',width:100,hidden:true,align:'left'},
                       {field:'TableCNName',title:'業務名稱',type:'string',link:true,width:100,align:'left'},
                       {field:'Field',title:'單據字段',type:'string',width:120,align:'left'},
                       {field:'CodeText2',title:'日期排序字段名稱',type:'string',width:180,hidden:true,align:'left'},
                       {field:'Name',title:'規則名稱',type:'string',width:100,hidden:true,require:true,align:'left'},
                       {field:'Code',title:'編碼預覽',type:'string',width:120,hidden:true,readonly:true,align:'left'},
                       {field:'PrefixCode',title:'前缀',type:'string',width:70,align:'left'},
                       {field:'RuleType',title:'規則類型',type:'string',width:80,require:true,align:'left'},
                       {field:'ValueLen',title:'編號位數',type:'int',width:70,require:true,align:'left'},
                       {field:'RuleIncremental',title:'增長類型',type:'string',width:90,hidden:true,align:'left'},
                       {field:'OrderFiled',title:'日期排序字段',type:'string',width:120,align:'left'},
                       {field:'ConcatenationSymbol',title:'連接符號',type:'string',width:90,hidden:true,align:'left'},
                       {field:'CodeText1',title:'單據字段名稱',type:'string',width:180,hidden:true,align:'left'},
                       {field:'Enable',title:'Enable',type:'int',width:110,hidden:true,align:'left'},
                       {field:'UserId',title:'UserId',type:'int',width:110,hidden:true,align:'left'},
                       {field:'TenancyId',title:'TenancyId',type:'string',width:120,hidden:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:90,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:140,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:90,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:140,hidden:true,align:'left'},
                       {field:'DbServiceId',title:'DbServiceId',type:'string',width:110,hidden:true,align:'left'}]);
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
