let columnType = [
  { key: 1, value: 'img' },
  { key: 2, value: 'excel' },
  { key: 3, value: 'file' },
  { key: 6, value: 'year(年)' },
  { key: 4, value: 'date(年月日)' },
  { key: 5, value: 'month(年月)' }
]

let dataType = [
  { key: 'text', value: 'input' },
  { key: 'textarea', value: 'textarea' },
  { key: 'switch', value: 'switch' },
  { key: 'select', value: 'select' },
  { key: 'selectList', value: 'select多選' },
  { key: 'year', value: '年' },
  { key: 'date', value: 'date(年月日)' },
  { key: 'datetime', value: 'datetime(年月日時分秒)' },
  { key: 'month', value: '年月' },
  { key: 'time', value: 'time' },
  { key: 'password', value: '密碼輸入框' },
  { key: 'checkbox', value: 'checkbox多選' },
  { key: 'radio', value: 'radio單選' },
  { key: 'cascader', value: '级聯' }, 
  { key: 'treeSelect', value: '樹形下拉框(多選)treeSelect' },
  { key: 'selectTable', value: '下拉框Table搜索' },
  { key: 'editor', value: '富文本編輯器' },
  { key: 'mail', value: 'mail' },
  { key: 'number', value: 'number' },
  { key: 'decimal', value: 'decimal' },
  { key: 'phone', value: 'phone' },
  { key: 'color', value: '顏色選擇器' },
  { key: 'img', value: 'img' },
  { key: 'excel', value: 'excel' },
  { key: 'file', value: 'file' },
  { key: 'rate', value: '評分' }
]

let searchDataType = [
  { key: '=', value: '等於' },
  { key: '!=', value: '不等於' },
  { key: 'like', value: '%模糊查詢%' },
  { key: 'likeStart', value: '模糊查詢%' },
  { key: 'likeEnd', value: '%模糊查詢' },
  { key: 'textarea', value: 'textarea' },
  { key: 'switch', value: 'switch' },
  { key: 'select', value: 'select' },
  { key: 'selectList', value: 'select多選' },
  { key: 'year', value: '年' },
  { key: 'date', value: 'date(年月日)' },
  { key: 'datetime', value: 'datetime(年月日時分秒)' },
  { key: 'month', value: 'year_month' },
  { key: 'time', value: 'time' },
  { key: 'cascader', value: '级聯' }, 
  { key: 'treeSelect', value: '樹形级聯tree-select' }, 
  { key: 'selectTable', value: '下拉框Table搜索' },
  { key: 'checkbox', value: 'checkbox' },
  { key: 'radio', value: 'radio' },
  { key: 'range', value: '區間查詢' },
  { key: 'mail', value: 'mail' },
  { key: 'number', value: 'number' },
  { key: 'decimal', value: 'decimal' }
  // { key: 'phone', value: 'phone' }
]

let data = {
  form: {
    fields: {
      table_Id: '',
      parentId: null,
      namespace: '',
      columnCNName: '',
      tableName: '',
      tableTrueName: '',
      folderName: '',
      detailCnName: '',
      detailName: '',
      expressField: '',
      sortName: '',
      richtitle: '',
      uploadField: '',
      uploadMaxCount: '',
      enable: 0,
      vuePath: '',
      appPath: '',
      dbServer: '',
      editType: null, //編輯模式
      userPermissionDesc: ''
    },
    addOptions: [
      [
        {
          title: '父 级 ID',
          min: 0,
          field: 'parentId',
          required: true,
          type: 'number',
          placeholder: '放在【代碼生成配置】列表的文件夾ID下,如果填入【0】就是一级目錄'
        },
        {
          title: '項目類庫',
          field: 'namespace',
          placeholder: '代碼生成後的所在類庫(可以自己提前在後台項目中創建一個.netcore類庫)',
          type: 'select',
          required: true,
          data: []
        }
      ],
      [
        {
          title: '表中文名',
          field: 'columnCNName',
          required: true,
          placeholder: '表對應的中文名字,界面上顯示會用到'
        },
        {
          title: '實際表名',
          field: 'tableName',
          required: true,
          placeholder: '數據庫實際表名或者視圖名(多表關聯請創建視圖再生成代碼)'
        }
      ],
      [
        {
          title: '文件夾名',
          placeholder:
            '生成文件所在類庫中的文件夾名(文件夾可以不存在);注意只需要填寫文件夾名，不是路徑',
          field: 'folderName',
          required: true
        },
        {
          title: '數據庫',
          field: 'dbServer',
          type: 'select',
          dataKey: 'dbServer',
          required: true,
    
          data: [] 
        }
      ]
    ],
    options: [
      [
        {
          title: '主 鍵 ID',
          field: 'table_Id',
          dataSource: [],
          readonly: true,
          disabled: true,
          columnType: 'int'
        },
        {
          title: '父 级 ID',
          field: 'parentId',
          min: 0,
          required: true,
          type: 'number'
        },
        {
          title: '項目類庫',
          placeholder: '代碼生成存放的位置',
          field: 'namespace',
          type: 'select',
          required: true,
          data: [],
          colSize: 6
        }
      ],
      [
        {
          title: '表中文名',
          field: 'columnCNName',
          dataSource: [],
          required: true
        },
        {
          title: '表 别 名',
          placeholder: '默認與實際表名相同',
          field: 'tableName',
          required: true
        },
        { title: '實際表名', field: 'tableTrueName' },
        {
          title: '文件夾名',
          placeholder: '生成文件所在類庫中的文件夾名(文件夾可以不存在)',
          field: 'folderName',
          required: true
        }
      ],
      [
        {
          title: '明细表中文名',
          field: 'detailCnName',
          placeholder: '多個名字,隔開'
        },
        { title: '明细表(多張表逗號隔開)', field: 'detailName', placeholder: '如：tabl1,table2' },
        {
          title: '快捷編輯',
          field: 'expressField',
          placeholder: '快捷編輯字段'
        },
        {
          title: '排序字段',
          field: 'sortName',
          placeholder: '多個排序字段逗號隔開(默認降序排序),如：Name,Age'
        }
      ],

      [
        {
          title: '編輯模式',
          field: 'editType',
          type: 'select',
          data: [
            { key: 0, value: '彈出框編輯' },
            { key: 1, value: '新頁面編輯' },
            { key: 2, value: '表格行内編輯' }
          ],
          extra: {
            render: (h) => {
              return (
                <el-popover
                  placement="top-start"
                  title="提示信息"
                  width={350}
                  trigger="hover"
                  content={
                    '1、彈出框編輯：以彈出框形式新建或修改 ；  2、新頁面編輯：打開一個新的tab頁面編輯或新建；   3、表格行内編輯：在當前查詢頁面的表格直接編輯'
                  }
                >
                  {{
                    reference: <span style="color:#9E9E9E" class="el-icon-warning-outline"></span>
                  }}
                </el-popover>
              )
            }
          }

          //  colSize: 6
        },
        {
          title: 'Vue路徑',
          field: 'vuePath',
          type: 'text',
          placeholder: '路徑：E:/app/src/views'
          //  colSize: 6
        },
        {
          title: 'app路徑',
          field: 'appPath',
          type: 'text',
          placeholder: '路徑：E:/uniapp/pages'
          /// colSize: 6
        },

        {
          title: '數據庫',
          field: 'dbServer',
          type: 'select',
          required: true,
          dataKey: 'dbServer',
          //2020.08.22配置多個數據庫的DBContext,數據源data的key必須與後台項目VOL.Core-》EFDbContext下的文件名相同
          data: [], // dbOptions
          extra: {
            render: (h) => {
              return (
                <el-popover
                  placement="top-start"
                  title="提示信息"
                  width={350}
                  trigger="hover"
                  content={'如果不分庫，選擇【系统庫SysDbContext】'}
                >
                  {{
                    reference: <span style="color:#9E9E9E" class="el-icon-warning-outline"></span>
                  }}
                </el-popover>
              )
            }
          }
        }
      ]
    ]
  },
  columns: [
    {
      field: 'columnId',
      title: 'ColumnId',
      width: 120,
      align: 'left',
      edit: { type: 'text' },
      hidden: true
    },
    {
      field: 'table_Id',
      title: 'Table_Id',
      width: 120,
      align: 'left',
      editor: 'text',
      hidden: true
    },
    {
      field: 'columnCnName',
      title: '列顯示名稱',
      fixed: true,
      width: 120,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'columnName',
      title: '列名',
      fixed: true,
      width: 120,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'isKey',
      title: '主鍵',
      width: 90,
      align: 'left',
      edit: { type: 'switch' }
    },
    {
      field: 'sortable',
      title: '是否排序',
      width: 90,
      align: 'left',
      edit: { type: 'switch', keep: true }
    },
    {
      field: 'enable',
      title: 'app列',
      width: 140,
      align: 'left',
      edit: { type: 'select' },
      bind: {
        data: [
          { key: 1, value: '顯示/查詢/編輯' },
          { key: 2, value: '顯示/編輯' },
          { key: 3, value: '顯示/查詢' },
          { key: 4, value: '顯示' },
          { key: 5, value: '查詢/編輯' },
          { key: 6, value: '查詢' },
          { key: 7, value: '編輯' }
        ]
      }
    },
    {
      field: 'searchRowNo',
      title: '查詢行',
      width: 90,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'searchColNo',
      title: '查詢列',
      width: 90,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'searchType',
      title: '查詢類型',
      width: 150,
      align: 'left',
      edit: { type: 'select' },
      bind: { data: searchDataType }
    },
    {
      field: 'editRowNo',
      title: '編輯行',
      width: 90,
      align: 'numberbox',
      edit: { type: 'text' }
    },
    {
      field: 'editColNo',
      title: '編輯列',
      width: 90,
      align: 'numberbox',
      edit: { type: 'text' }
    },
    {
      field: 'editType',
      title: '編輯類型',
      width: 150,
      align: 'left',
      edit: { type: 'select' },
      bind: { data: dataType }
    },
    {
      field: 'dropNo',
      title: '數據源',
      width: 120,
      align: 'left',
      bind: { data: [] },
      edit: { type: 'select', data: [] }
    },
    {
      field: 'isImage',
      title: 'table列顯示類型',
      hidden: false,
      width: 130,
      align: 'left',
      edit: { type: 'select' },
      bind: { data: columnType }
    },
    {
      field: 'orderNo',
      title: '列顯示順序',
      width: 120,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'maxlength',
      title: '字段最大長度',
      width: 130,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'columnType',
      title: '數據類型',
      width: 120,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'isNull',
      title: '可為空',
      width: 120,
      align: 'left',
      edit: { type: 'switch', keep: true }
    },
    {
      field: 'isReadDataset',
      title: '是否只讀',
      width: 120,
      align: 'left',
      edit: { type: 'switch', keep: true }
    },
    {
      field: 'isColumnData',
      title: '數據列',
      width: 120,
      align: 'left',
      edit: { type: 'switch', keep: true }
    },
    {
      field: 'isDisplay',
      title: '是否顯示',
      width: 120,
      align: 'left',
      edit: { type: 'switch', keep: true }
    },
    {
      field: 'columnWidth',
      title: 'table列寬度',
      width: 120,
      align: 'left',
      edit: { type: 'text' }
    },
    {
      field: 'colSize',
      title: '編輯字段寬度colSize',
      width: 180,
      align: 'left',
      edit: { type: 'select' },
      bind: {
        data: [
          { key: 0, value: '自動寬度' },
          { key: 2, value: '20%' },
          { key: 3, value: '30%' },
          { key: 4, value: '40%' },
          { key: 6, value: '50%' },
          { key: 8, value: '60%' },
          { key: 10, value: '80%' },
          { key: 12, value: '100%' }
        ]
      }
    },
    { field: 'createDate', title: '創建時間', width: 120, align: 'left' }
  ]
}

export default data
