// *Author：jxx
// *Contact：283591387@qq.com
// *代码由框架生成,任何更改都可能导致被代码生成器覆盖
export default function(){
    const table = {
        key: 'template_id',
        footer: "Foots",
        cnName: '專案層級樣板',
        name: 'sf_project_template',
        newTabEdit: false,
        url: "/sf_project_template/",
        sortName: "CreateDate"
    };
    const tableName = table.name;
    const tableCNName = table.cnName;
    const newTabEdit = false;
    const key = table.key;
    const editFormFields = {"name":"","description":"","parentId":"","level_name":""};
    const editFormOptions = [[{"title":"名稱","required":true,"field":"name"},
                               {"title":"描述","field":"description"}],
                              [{"dataKey":"專案樣板","data":[],"title":"上階名稱","field":"parentId","type":"select"},
                               {"dataKey":"專案樣板層級屬性","data":[],"title":"階層名稱","field":"level_name","type":"select"}]];
    const searchFormFields = {};
    const searchFormOptions = [];
    const columns = [{field:'template_id',title:'主鍵',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'name',title:'名稱',type:'string',link:true,width:180,require:true,align:'left'},
                       {field:'description',title:'描述',type:'string',width:150,align:'left'},
                       {field:'parentId',title:'上階名稱',type:'int',bind:{ key:'專案樣板',data:[]},width:110,align:'left'},
                       {field:'level_name',title:'階層名稱',type:'int',bind:{ key:'專案樣板層級屬性',data:[]},width:110,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'創建人',type:'string',width:100,align:'left'},
                       {field:'CreateDate',title:'創建時間',type:'datetime',width:150,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改時間',type:'datetime',width:150,hidden:true,align:'left'}];
    const detail ={columns:[]};
    const details = [];

    return {
        table,
        key,
        tableName,
        tableCNName,
        newTabEdit,
        editFormFields,
        editFormOptions,
        searchFormFields,
        searchFormOptions,
        columns,
        detail,
        details
    };
}