//2024.11.16重寫组件
export default function () {
    return {
        rowKey: {
            // 樹形结構的主鍵字段，如果設置值默認會開啟樹形table；注意rowKey字段的值必須是唯一（2021.05.02）
            typeof: String,
            default: undefined
        },
        loadTreeChildren: {
            // 樹形结構加載子節點
            type: Function,
            default: (tree, treeNode, resolve) => {
                if (resolve) {
                    return resolve([])
                }
            }
        },
        textInline: {
            // 表格内容超出後是否換行顯示（2020.01.16）
            type: Boolean,
            default: true
        },
        tableData: {
            // 表數據源,配置了url就不用傳這個參數了
            type: Array,
            default: () => {
                return []
            }
        },
        columns: {
            type: Array,
            default: []
        },
        height: {
            type: Number,
            default: 0
        },
        extraHeight: {
            type: Number,
            default: 0
        },
        maxHeight: {
            type: Number,
            default: 0
        },
        linkView: {
            type: Function,
            default: function () {
                return 1
            }
        },
        pagination: {
            type: Object,
            default: function () {
                return { total: 0, size: 30, sortName: '' }
            }
        },
        url: {
            type: String,
            default: ''
        },
        paginationHide: {
            type: Boolean,
            default: true
        },
        color: {
            type: Boolean,
            default: true
        },
        index: {
            // 是否創建索引號,如果需要表格編輯功能，這裡需要設置為true
            type: Boolean,
            default: false
        },
        allowEmpty: {
            // 表格數據為空時是否默認為--
            type: Boolean,
            default: true
        },
        defaultLoadPage: {
            // 傳入了url，是否默認加載表格數據
            type: Boolean,
            default: true
        },
        loadKey: {
            // 是否自動從後台加載數據源
            type: Boolean,
            default: true
        },
        single: {
            type: Boolean, // 是否單選
            default: false
        },
        doubleEdit: {
            type: Boolean, // 是否双擊啟用編輯功能
            default: true
        },
        beginEdit: {
            // 編輯開始
            type: Function,
            default: function (row, column, index) {
                return true
            }
        },
        endEditBefore: {
            // 结束編輯前
            type: Function,
            default: function (row, column, index) {
                return true
            }
        },
        endEditAfter: {
            // 结束編輯前
            type: Function,
            default: function (row, column, index) {
                return true
            }
        },
        ck: {
            // 是否顯示checkbox
            type: Boolean,
            default: true
        },
        columnIndex: {
            // 是否顯示行號(2020..11.1)
            type: Boolean,
            default: true
        },
        highlightCurrentRow: {
            //增加選中行高亮顯示(2022.10.07)
            type: Boolean,
            default: true
        },
        select2Count: {
            //超出數量顯示select2组件
            type: Number,
            default: 1500
        },
        selectable: {
            type: Function,
            default: (row, index) => {
                return true
            }
        },
        lazy: {
            //樹形表格是否默認延遲加載
            type: Boolean,
            default: true
        },
        defaultExpandAll: {
            //樹形表格是否展開所有
            type: Boolean,
            default: false
        },
        expandRowKeys: {
            //默認展開行
            type: Array,
            default: () => {
                return []
            }
        },
        rowParentField: {
            //樹形表格父级id
            type: String,
            default: ''
        },
        dragPosition: {
            //2023.11.22
            type: String,
            default: '' //可拖動位置，頂部拖動top,底部bottom
        },
        spanMethod: {
            type: Function,
            default: ({ row, column, rowIndex, columnIndex }, rows) => { }
        },
        reserveSelection: {
            //分頁或者刷新表格數據後是否保留複選框選擇狀態，2024.09.10
            type: Boolean,
            default: false
        },
        sortable: {
            //表格是否可以拖拽排序
            type: Boolean,
            default: false
        }
    }
}