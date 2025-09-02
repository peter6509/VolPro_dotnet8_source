

let options1 = [
    {
        "id": 1,
        "name": "輸入框",
        "type": "text",
        "value": "",
        "icon": "el-icon-document",
        "field": "field1630258884671",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 3,
        "name": "日期",
        "type": "date",
        "icon": "el-icon-date",
        "value": null,
        "field": "field1630258891760",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 7,
        "name": "下拉框",
        "value": null,
        "key": "",
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "type": "select",
        "icon": "el-icon-arrow-down",
        "field": "field1630258904862",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 8,
        "name": "下拉多選",
        "type": "selectList",
        "key": "",
        "values": [],
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "icon": "el-icon-arrow-down",
        "field": "field1630258924442",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 81,
        "name": "级聯",
        "type": "cascader",
        "icon": "el-icon-share",
        "values": [],
        "key": "",
        "data": [
            {
                "value": "請配置數據源",
                "label": "請配置數據源",
                "children": [
                    {
                        "value": "具體",
                        "label": "菜單:下拉框绑定設置"
                    },
                    {
                        "value": "color",
                        "label": "可參照字典編號[tree_roles]"
                    }
                ]
            }
        ],
        "field": "field1630259518082",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 6,
        "name": "多選",
        "values": [
            "發貨"
        ],
        "type": "checkbox",
        "key": "ordertype",
        "data": [
            {
                "key": "1",
                "value": "發貨"
            },
            {
                "key": "2",
                "value": "退貨"
            },
            {
                "key": "3",
                "value": "返單"
            }
        ],
        "icon": "el-icon-circle-check",
        "field": "field1630259033241",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 5,
        "name": "單選",
        "type": "radio",
        "icon": "el-icon-aim",
        "value": 0,
        "data": [
            {
                "key": "0",
                "value": "否"
            },
            {
                "key": "2",
                "value": "xx11"
            },
            {
                "key": "1",
                "value": "是"
            }
        ],
        "key": "enable",
        "field": "field1630259538490",
        "width": 30,
        "readonly": false,
        "required": false,
        "values": [
            "否"
        ]
    },
    {
        "id": 4,
        "name": "switch",
        "type": "switch",
        "icon": "el-icon-turn-off",
        "value": 0,
        "field": "field1630259172794",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 12,
        "name": "分段信息",
        "type": "line",
        "icon": "el-icon-guide",
        "field": "field1630259600186",
        "width": 100,
        "readonly": false,
        "required": false
    },
    {
        "id": 9,
        "name": "圖片",
        "type": "img",
        "url": "api/SellOrder/upload",
        "maxSize": 3,
        "fileInfo": [],
        "multiple": false,
        "autoUpload": false,
        "maxFile": 5,
        "icon": "el-icon-picture-outline",
        "field": "field1630259295154",
        "width": 100,
        "readonly": false,
        "required": false
    },
    {
        "id": 10,
        "name": "excel",
        "url": "api/SellOrder/upload",
        "maxSize": 3,
        "multiple": false,
        "autoUpload": true,
        "maxFile": 5,
        "fileInfo": [],
        "type": "excel",
        "icon": "el-icon-upload",
        "field": "field1630259610476",
        "width": 100,
        "readonly": false,
        "required": false
    },
    {
        "id": 5,
        "name": "單選",
        "type": "radio",
        "icon": "el-icon-aim",
        "value": 0,
        "data": [
            {
                "key": "0",
                "value": "審核中"
            },
            {
                "key": "1",
                "value": "審核通過"
            },
            {
                "key": "2",
                "value": "審核未通過"
            }
        ],
        "key": "audit",
        "field": "field1630258969346",
        "width": 40,
        "readonly": false,
        "required": false,
        "values": [
            "審核中"
        ]
    }
];
let options2=[
    {
        "id": 1,
        "name": "輸入框",
        "type": "text",
        "value": "",
        "icon": "el-icon-document",
        "field": "field1630258884671",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 3,
        "name": "日期",
        "type": "date",
        "icon": "el-icon-date",
        "value": null,
        "field": "field1630258891760",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 7,
        "name": "下拉框",
        "value": null,
        "key": "",
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "type": "select",
        "icon": "el-icon-arrow-down",
        "field": "field1630258904862",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 8,
        "name": "下拉多選",
        "type": "selectList",
        "key": "",
        "values": [],
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "icon": "el-icon-arrow-down",
        "field": "field1630258924442",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 2,
        "name": "textarea",
        "type": "textarea",
        "value": "",
        "icon": "el-icon-document-copy",
        "field": "field1630260207393",
        "width": 100,
        "readonly": false,
        "required": false
    },
    {
        "id": 13,
        "name": "表格",
        "type": "table",
        "tabs": true,
        "columns": [
            {
                "title": "運單號",
                "field": "TranNo",
                "show": true,
                "required": false,
                "edit": true,
                "dataType": null,
                "dataSource": null,
                "width": "140",
                "orderNo": null,
                "elementIndex": 0
            },
            {
                "title": "銷售訂單號",
                "field": "SellNo",
                "show": true,
                "required": false,
                "edit": true,
                "dataType": null,
                "dataSource": null,
                "width": "140",
                "orderNo": null,
                "elementIndex": 1
            },
            {
                "title": "訂單類型",
                "field": "OrderType",
                "show": true,
                "required": false,
                "edit": true,
                "dataType": null,
                "dataSource": "ordertype",
                "width": 120,
                "orderNo": null,
                "elementIndex": 2,
                "editType": "select"
            },
            {
                "title": "銷售數量",
                "field": "Qty",
                "show": true,
                "required": false,
                "edit": true,
                "dataType": null,
                "dataSource": null,
                "width": "80",
                "orderNo": null,
                "elementIndex": 3
            },
            {
                "field": "CreateDate",
                "elementIndex": 4,
                "show": 1,
                "required": 0,
                "edit": 0,
                "title": "訂單時間",
                "dataType": "date",
                "width": "100"
            }
        ],
        "tableData": [
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            },
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            },
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            }
        ],
        "height": 200,
        "icon": "el-icon-c-scale-to-original",
        "url": "api/SellOrder/getPageData",
        "index": false,
        "columnIndex": false,
        "ck": true,
        "buttons": [
            {
                "name": "添加行",
                "ck": false,
                "icon": "el-icon-plus",
                "value": "add"
            },
            {
                "name": "删除行",
                "ck": false,
                "icon": "el-icon-delete",
                "value": "del"
            },
            {
                "name": "刷新",
                "ck": false,
                "icon": "el-icon-refresh-right",
                "value": "ref"
            }
        ],
        "field": "field1630260242867",
        "width": 100,
        "readonly": false,
        "required": false,
        "pagination": false
    },
    {
        "id": 13,
        "name": "表格",
        "type": "table",
        "tabs": true,
        "columns": [
            {
                "title": "字段1",
                "field": "field1",
                "show": true,
                "required": false,
                "edit": false,
                "dataType": null,
                "dataSource": null,
                "width": 120,
                "orderNo": null
            },
            {
                "title": "字段2",
                "field": "field2",
                "show": true,
                "required": false,
                "edit": false,
                "dataType": null,
                "dataSource": null,
                "width": 120,
                "orderNo": null
            },
            {
                "title": "字段3",
                "field": "field3",
                "show": true,
                "required": false,
                "edit": false,
                "dataType": null,
                "dataSource": null,
                "width": 120,
                "orderNo": null
            },
            {
                "title": "字段4",
                "field": "field4",
                "show": true,
                "required": false,
                "edit": false,
                "dataType": null,
                "dataSource": null,
                "width": 120,
                "orderNo": null
            }
        ],
        "tableData": [
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            },
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            },
            {
                "field1": "field1",
                "field2": "field2",
                "field3": "field3",
                "field4": "field4"
            }
        ],
        "height": 200,
        "icon": "el-icon-c-scale-to-original",
        "url": null,
        "index": false,
        "columnIndex": false,
        "ck": true,
        "buttons": [
            {
                "name": "添加行",
                "ck": false,
                "icon": "el-icon-plus",
                "value": "add"
            },
            {
                "name": "删除行",
                "ck": false,
                "icon": "el-icon-delete",
                "value": "del"
            },
            {
                "name": "刷新",
                "ck": false,
                "icon": "el-icon-refresh-right",
                "value": "ref"
            }
        ],
        "field": "field1630260481283",
        "width": 100,
        "readonly": false,
        "required": false,
        "pagination": true
    }
]

let options3=[
    {
        "id": 1,
        "name": "輸入框",
        "type": "text",
        "value": "",
        "icon": "el-icon-document",
        "field": "field1630258884671",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 3,
        "name": "日期",
        "type": "date",
        "icon": "el-icon-date",
        "value": null,
        "field": "field1630258891760",
        "width": 20,
        "readonly": false,
        "required": false
    },
    {
        "id": 7,
        "name": "下拉框",
        "value": null,
        "key": "",
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "type": "select",
        "icon": "el-icon-arrow-down",
        "field": "field1630258904862",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 8,
        "name": "下拉多選",
        "type": "selectList",
        "key": "",
        "values": [],
        "data": [
            {
                "label": "請設置數據源",
                "value": "請設置數據源"
            }
        ],
        "icon": "el-icon-arrow-down",
        "field": "field1630258924442",
        "width": 30,
        "readonly": false,
        "required": false
    },
    {
        "id": 5,
        "name": "單選",
        "type": "radio",
        "icon": "el-icon-aim",
        "value": 0,
        "data": [
            {
                "key": "0",
                "value": "否"
            },
            {
                "key": "2",
                "value": "xx11"
            },
            {
                "key": "1",
                "value": "是"
            }
        ],
        "key": "enable",
        "field": "field1630260669595",
        "width": 50,
        "readonly": false,
        "required": false,
        "values": [
            "否"
        ]
    },
    {
        "id": 6,
        "name": "多選",
        "values": [
            "否"
        ],
        "type": "checkbox",
        "key": "enable",
        "data": [
            {
                "key": "0",
                "value": "否"
            },
            {
                "key": "2",
                "value": "xx11"
            },
            {
                "key": "1",
                "value": "是"
            }
        ],
        "icon": "el-icon-circle-check",
        "field": "field1630260695322",
        "width": 50,
        "readonly": false,
        "required": false
    },
    {
        "id": 2,
        "name": "textarea",
        "type": "textarea",
        "value": "",
        "icon": "el-icon-document-copy",
        "field": "field1630260207393",
        "width": 100,
        "readonly": false,
        "required": false
    },
    {
        "id": 13,
        "name": "編輯器",
        "type": "editor",
        "value": "",
        "url": "",
        "height": 200,
        "icon": "el-icon-notebook-2",
        "field": "field1630260646842",
        "width": 100,
        "readonly": false,
        "required": false
    }
]
export { options1, options2,options3 }
