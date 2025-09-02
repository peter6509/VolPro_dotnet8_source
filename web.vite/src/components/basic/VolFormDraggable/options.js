const components = [
    {
        id: 1,
        name: "輸入框",
        type: "text",
        value: "",
        icon: "el-icon-document",
    },
    {
        id: 2,
        name: "textarea",
        type: "textarea",
        value: "",
        icon: "el-icon-document-copy",
    },
    {
        id: 3,
        name: "日期",
        type: "date",
        icon: "el-icon-date",
        value: null,
    },
    {
        id: 4,
        name: "switch",
        type: "switch",
        icon: "el-icon-turn-off",
        value: 0,
    },
    { id: 5, name: "單選", type: "radio", icon: "el-icon-aim", value: 0, data: [{ label: "0", value: "請設置數據源1" }, { label: "1", value: "請設置數據源2" }], key: "" },
    {
        id: 6,
        name: "多選",
        values: [],
        type: "checkbox",
        key: "",
        data: [{ label: "請設置數據源", value: "請設置數據源" }],
        icon: "el-icon-circle-check",
    },
    {
        id: 7,
        name: "下拉框",
        value: null,
        key: "",
        data: [{ label: "請設置數據源", value: "請設置數據源" }],
        type: "select",
        icon: "el-icon-arrow-down",
    },
    {
        id: 8,
        name: "下拉框多選",
        type: "selectList",
        key: "",
        values: [],
        data: [{ label: "請設置數據源", value: "請設置數據源" }],
        icon: "el-icon-arrow-down",
    },
    {
        id: 81,
        name: "级聯",
        type: "cascader",
        icon: "el-icon-share",
        values: [],
        key: "",
        data: [
            {
                value: "請配置數據源",
                label: "請配置數據源",
                children: [
                    {
                        value: "具體",
                        label: "菜單:下拉框绑定設置",
                    },
                    {
                        value: "color",
                        label: "可參照字典編號[tree_roles]",
                    }
                ],
            },
        ],
    },
    {
        id: 9,
        name: "圖片上傳",
        type: "img",
        url: "",
        maxSize: 3,
        fileInfo: [],
        multiple: false,
        autoUpload: false,
        maxFile: 5,
        icon: "el-icon-picture-outline",
    },
    {
        id: 10,
        name: "excel上傳",
        url: "",
        maxSize: 3,
        multiple: false,
        autoUpload: false,
        maxFile: 5, //最多可上傳5個文件 
        fileInfo: [],
        type: "excel",
        icon: "el-icon-upload",
    },
    {
        id: 11,
        name: "文件上傳",
        type: "file",
        url: "",
        maxSize: 3,
        multiple: false,
        autoUpload: false,
        maxFile: 5,
        fileInfo: [],
        icon: "el-icon-folder-opened",
    },
    {
        id: 12,
        name: "分段信息",
        type: "line",
        icon: "el-icon-guide",
    },
    {
        id: 13,
        name: "編輯器",
        type: "editor",
        value: "",
        url: "",
        height: 200,
        icon: "el-icon-notebook-2",
    },
    {
        id: 13,
        name: "彈出框",
        type: "box",
        value: "",
        url: "",
        height: 250,
        icon: "el-icon-notebook-2",
    },
    {
        id: 13,
        name: "表格",
        type: "table",
        tabs: false,
        columns: [
            { title: "字段1", field: "field1", show: true, required: false, edit: false, dataType: null, dataSource: null, width: 120, orderNo: null },
            { title: "字段2", field: "field2", show: true, required: false, edit: false, dataType: null, dataSource: null, width: 120, orderNo: null },
            { title: "字段3", field: "field3", show: true, required: false, edit: false, dataType: null, dataSource: null, width: 120, orderNo: null },
            { title: "字段4", field: "field4", show: true, required: false, edit: false, dataType: null, dataSource: null, width: 120, orderNo: null },
            // { title: "字段5", field: "Field5", width: 120 },
        ],
        tableData: [
            {
                field1: "field1",
                field2: "field2",
                field3: "field3",
                field4: "field4",
            },
            {
                field1: "field1",
                field2: "field2",
                field3: "field3",
                field4: "field4",
            },
            {
                field1: "field1",
                field2: "field2",
                field3: "field3",
                field4: "field4",
            },
        ],
        height: 150,
        icon: "el-icon-c-scale-to-original",
        url: null,
        index: false, //item.index,
        height: 200,
        index: false,
        columnIndex: false,
        ck: true,
        buttons: [
            { name: '添加行', ck: false, icon: 'el-icon-plus',value:'add' },
        { name: '删除行', ck: false, icon: 'el-icon-delete',value:'del' }, 
        { name: '刷新', ck: false ,icon:'el-icon-refresh-right',value:'ref'}],
    },
]
const tableOption = [
    { field: 'field', title: '字段', edit: { type: "text", keep: true }, width: 160 },
    { field: 'title', title: '字段中文名', edit: { type: "text", keep: true }, width: 120 },
    { field: 'show', title: '是否顯示', edit: { type: "switch", keep: true }, width: 90 },
    {
        field: 'dataType', title: '顯示類型', edit: { type: "select", keep: true }, width: 120, bind: {
            key: '', data: [
                { "key": "switch", "value": "單選" },
                { "key": "date", "value": "年月日" },
                { "key": "img", "value": "圖片" },
                { "key": "excel", "value": "excel" },
                { "key": "file", "value": "文件" }
            ]
        }
    },

    { field: 'required', title: '是否必填', edit: { type: "switch", keep: true }, width: 90 },
    { field: 'edit', title: '是否可編輯', edit: { type: "switch", keep: true }, width: 90 },
    {
        field: 'editType', title: '編輯類型', edit: { type: "select", keep: true, }, width: 120, bind: {
            key: '', data: [{ "key": "text", "value": "輸入框" },
            { "key": "switch", "value": "單選" },
            { "key": "select", "value": "下拉框" },
            { "key": "selectList", "value": "下拉框多選" },
            { "key": "date", "value": "日期" },
            { "key": "datetime", "value": "日期時分秒" },
            { "key": "checkbox", "value": "複選框多選" },
            { "key": "mail", "value": "郵箱地址" },
            { "key": "number", "value": "數字" },
            { "key": "decimal", "value": "小數" },
            { "key": "phone", "value": "手機號" },
            ]
        }
    },
    { field: 'dataSource', title: '數據源', edit: { type: "select", keep: true, data: [] }, bind: { key: '', data: [] }, width: 120 },
    { field: 'width', title: '列寬度', edit: { type: "text", keep: true }, width: 80 },
    { field: 'orderNo', title: '列顯示順序', edit: { type: "text", keep: true }, width: 100 }
];
export { components, tableOption }