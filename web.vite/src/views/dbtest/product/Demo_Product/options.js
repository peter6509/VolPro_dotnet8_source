export default function () {
    const editFormFields = { "ProductName": "", "ProductCode": "", "Price": "", "Remark": "", "Creator": "", "CreateDate": "", "Modifier": "", "ModifyDate": "" };
    const editFormOptions = [[{ "title": "商品名稱", "required": true, "field": "ProductName" },
    { "title": "商品編號", "required": true, "field": "ProductCode" },
    { "title": "價格", "required": true, "field": "Price", "type": "number" },
    { "title": "備註", "field": "Remark" }],
    [{ "title": "創建人", "field": "Creator", "disabled": true },
    { "title": "創建時間", "field": "CreateDate", "disabled": true },
    { "title": "修改人", "field": "Modifier", "disabled": true },
    { "title": "修改時間", "field": "ModifyDate", "disabled": true }]];
    const tableName = "Demo_Product";
    const tableCNName = "產品管理";
    const newTabEdit = true;
    const key = 'ProductId';
    const detail = {
        cnName: "#detailCnName",
        table: "#detailTable",
        url: "api/Demo_Product/getDetailPage",
        columns: [],
        sortName: "#detailSortName",
        key: "#detailKey"
    };

    const details = [{
        cnName: '顏色',
        table: 'Demo_ProductColor',
        columns: [{ field: 'ProductColorId', title: 'ProductColorId', type: 'guid', width: 110, hidden: true, readonly: true, require: true, align: 'left' },
        { field: 'ProductId', title: '商品id', type: 'guid', width: 110, hidden: true, align: 'left' },
        { field: 'Color', title: '顏色', type: 'string', bind: { key: '顏色', data: [] }, width: 100, edit: { type: 'radio' }, require: true, align: 'left' },
        { field: 'Qty', title: '數量', type: 'string', link: true, width: 90, edit: { type: '' }, require: true, align: 'left' },
        { field: 'Unit', title: '單位', type: 'string', bind: { key: '單位', data: [] }, width: 90, edit: { type: 'select' }, require: true, align: 'left' },
        { field: 'Img', title: '圖片', type: 'img', width: 90, edit: { type: 'img' }, require: true, align: 'left' },
        { field: 'Remark', title: '備註', type: 'string', width: 130, edit: { type: '' }, align: 'left' },
        { field: 'CreateID', title: 'CreateID', type: 'int', width: 80, hidden: true, align: 'left' },
        { field: 'Creator', title: '創建人', type: 'string', width: 110, align: 'left' },
        { field: 'CreateDate', title: '創建時間', type: 'datetime', width: 150, align: 'left' },
        { field: 'ModifyID', title: 'ModifyID', type: 'int', width: 80, hidden: true, align: 'left' },
        { field: 'Modifier', title: '修改人', type: 'string', width: 110, hidden: true, align: 'left' },
        { field: 'ModifyDate', title: '修改時間', type: 'datetime', width: 200, hidden: true, align: 'left' }],
        sortName: 'CreateDate',
        key: 'ProductColorId',
        buttons: [],
        delKeys: [],
        detail: {
            cnName: '產品顏色明细',
            table: 'Demo_ProductColorSub',
            firstTable: 'Demo_Product',
            secondTable: 'Demo_ProductColor',
            secondKey: 'ProductColorId',
            sortName: 'CreateDate',
            key: 'ProductColorSubId',
            buttons: [],
            delKeys: [],
             columns: [{field:'ProductColorSubId',title:'ProductColorSubId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'ProductColorId',title:'產品顏色Id',type:'guid',width:110,hidden:true,align:'left'},
                {field:'FactoryLocation',title:'生產地',type:'string',width:100,edit:{type:''},require:true,align:'left'},
                {field:'Manufacturer',title:'生產商',type:'string',width:100,edit:{type:''},require:true,align:'left'},
                {field:'ProductionDate',title:'生產日期',type:'date',width:110,edit:{type:'date'},align:'left'},
                {field:'Quantity',title:'數量',type:'int',width:110,edit:{type:'number'},require:true,align:'left'},
                {field:'Price',title:'價格',type:'decimal',width:110,edit:{type:'number'},require:true,align:'left'},
                {field:'Remark',title:'備註',type:'string',width:100,edit:{type:''},align:'left'},
                {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                {field:'Creator',title:'創建人',type:'string',width:80,align:'left'},
                {field:'CreateDate',title:'創建時間',type:'datetime',width:100,align:'left'},
                {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                {field:'Modifier',title:'Modifier',type:'string',width:130,hidden:true,align:'left'},
                {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'},]
        }
    },
    {
        cnName: '尺寸列表',
        table: 'Demo_ProductSize',
        columns: [{ field: 'ProductSizeId', title: 'ProductSizeId', type: 'guid', width: 110, hidden: true, readonly: true, require: true, align: 'left' },
        { field: 'ProductId', title: '商品id', type: 'guid', width: 110, hidden: true, align: 'left' },
        { field: 'Size', title: '尺寸', type: 'string', bind: { key: '尺寸', data: [] }, width: 120, edit: { type: 'select' }, require: true, align: 'left' },
        { field: 'Unit', title: '單位', type: 'string', bind: { key: '單位', data: [] }, width: 90, edit: { type: 'select' }, require: true, align: 'left' },
        { field: 'Remark', title: '備註', type: 'string', link: true, width: 120, edit: { type: '' }, align: 'left' },
        { field: 'CreateID', title: 'CreateID', type: 'int', width: 80, hidden: true, align: 'left' },
        { field: 'Creator', title: '創建人', type: 'string', width: 120, align: 'left' },
        { field: 'CreateDate', title: '創建時間', type: 'datetime', width: 150, align: 'left' },
        { field: 'ModifyID', title: 'ModifyID', type: 'int', width: 80, hidden: true, align: 'left' },
        { field: 'Modifier', title: '修改人', type: 'string', width: 120, align: 'left' },
        { field: 'ModifyDate', title: '修改時間', type: 'datetime', width: 200, align: 'left' }],
        sortName: 'CreateDate',
        key: 'ProductSizeId',
        buttons: [],
        delKeys: [],
        detail: {
            cnName: '產品尺寸明细',
            table: 'Demo_ProductSizeSub',
            firstTable: 'Demo_Product',
            secondTable: 'Demo_ProductSize',
            secondKey: 'ProductSizeId',
            sortName: 'CreateDate',
            key: 'ProductSizeSubId',
            buttons: [],
            delKeys: [],
            columns: [{field:'ProductSizeSubId',title:'ProductSizeSubId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'ProductSizeId',title:'產品尺寸ID',type:'guid',width:110,hidden:true,align:'left'},
                {field:'ChestCircumference',title:'胸圍尺寸',type:'string',width:90,edit:{type:''},require:true,align:'left'},
                {field:'WaistCircumference',title:'腰圍尺寸',type:'string',width:90,edit:{type:''},require:true,align:'left'},
                {field:'HipCircumference',title:'臀圍尺寸',type:'string',width:90,edit:{type:''},require:true,align:'left'},
                {field:'ShoulderWidth',title:'肩寬尺寸',type:'string',width:90,edit:{type:''},require:true,align:'left'},
                {field:'Remark',title:'備註',type:'string',width:100,edit:{type:''},align:'left'},
                {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                {field:'Creator',title:'創建人',type:'string',width:80,align:'left'},
                {field:'CreateDate',title:'創建時間',type:'datetime',width:140,align:'left'},
                {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                {field:'Modifier',title:'Modifier',type:'string',width:130,hidden:true,align:'left'},
                {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'},]
        }
    }]

    return {
        key,
        tableName,
        tableCNName,
        editFormFields,
        editFormOptions,
        detail,
        details,
        newTabEdit
    }
}