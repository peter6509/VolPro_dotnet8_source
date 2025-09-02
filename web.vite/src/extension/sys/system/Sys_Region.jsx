/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import { h, resolveComponent } from 'vue'
import gridBody from './Sys_RegionGridBody'
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: {
      render() {
        return [
          h(
            resolveComponent('el-alert'),
            {
              style: { 'margin-top': '2px', 'margin-bottom': '-7px' },
              'show-icon': true,
              type: 'success',
              closable: false,
              title:
                '代碼生成器可配置編輯模式，直接在table上進行删除、修改操作，支持多個快捷查詢字段,設置this.sortable=true可拖動行自動排序'
            },
            ''
          )
        ]
      }
    },
    gridBody: gridBody,
    gridFooter: '',
    //新建、編輯彈出框擴展组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    //下面這些方法可以保留也可以删除
    searchAfter(result) {
      //2、查詢後方法，調用自定義列表設置值
      this.$refs.gridBody.loadList(result, this.columns)
      return true
    },
    sortEnd(newIndex, oldIndex, rows) {
      console.log(this.editFormFields)
    },
    //下面這些方法可以保留也可以删除
    onInit() {
      //此處僅作為演示默認查詢使用
      if (
        !localStorage.getItem('filter:systemSys_Region:name') ||
        localStorage.getItem('filter:systemSys_Region:name') == '[]'
      ) {
        localStorage.setItem(
          'filter:systemSys_Region:name',
          '["默認查詢","北京市查詢","上海市查詢"]'
        )
        localStorage.setItem(
          'filter:systemSys_Region',
          '[{"name":"默認查詢","value":[{"field":"code","title":"編碼","icon":"el-icon-document","searchType":"like","value":null,"type":"string","width":25},{"field":"name","title":"名稱","icon":"el-icon-document","searchType":"like","value":null,"type":"string","width":25},{"field":"mername","title":"完整地址","icon":"el-icon-document","searchType":"like","value":null,"type":"string","width":25},{"field":"pinyin","title":"拼音","icon":"el-icon-document","searchType":null,"value":null,"type":"string","width":25}]},{"name":"北京市查詢","value":[{"field":"mername","title":"完整地址","icon":"el-icon-document","searchType":"like","value":"北京","type":"string","width":25},{"field":"pinyin","title":"拼音","icon":"el-icon-document","searchType":"likeStart","value":null,"type":"string","width":25}]},{"name":"上海市查詢","value":[{"field":"mername","title":"完整地址","icon":"el-icon-document","searchType":"like","value":"上海","type":"string","width":25},{"field":"name","title":"名稱","icon":"el-icon-document","searchType":"like","value":null,"type":"string","width":25},{"field":"pinyin","title":"拼音","icon":"el-icon-document","searchType":"likeStart","value":null,"type":"string","width":25}]}]'
        )
      }

      this.sortable = true

      //設置多個快捷查詢字段
      this.queryFields = ['mername', 'name']
      //1、自定義按鈕切換頁面顯示
      this.isList = true
      this.buttons.push({
        plain: true,
        name: '列表', //按鈕名稱
        icon: 'el-icon-document', //按鈕圖標，參照iview圖標
        type: 'primary',
        onClick: () => {
          this.isList = !this.isList
          this.buttons[this.buttons.length - 1].name = this.isList ? '表格' : '列表'
          //設置自定義列表顯示
          this.$refs.gridBody.show()
        }
      })

      this.columns.forEach((x) => {
        if (x.field == 'mername') {
          x.tip = {
            text: '<a>標題長度不够時</br>可自定義標題或提示信息</a>',
            click: () => {
              this.$message.success('點擊了表頭')
            }
          }
        } else if (x.field == 'name') {
          x.tip = {
            text: '自定義標題提示',
            icon: 'bi-text-right',
            click: () => {
              this.$message.success('點擊了表頭')
            }
          }
        }
      })
      //示例：在按鈕的最前面添加一個按鈕
      //   this.buttons.unshift({  //也可以用push或者splice方法來修改buttons數组
      //     name: '按鈕', //按鈕名稱
      //     icon: 'el-icon-document', //按鈕圖標vue2版本見iview文檔icon，vue3版本見element ui文檔icon(注意不是element puls文檔)
      //     type: 'primary', //按鈕樣式vue2版本見iview文檔button，vue3版本見element ui文檔button
      //     onClick: function () {
      //       this.$Message.success('點擊了按鈕');
      //     }
      //   });

      //示例：設置修改新建、編輯彈出框字段標籤的長度
      // this.boxOptions.labelWidth = 150;
    },
    onInited() {
      this.height = this.height - 30

      //如果是一對多明细，给二级明细表绑定下拉搜索:
      //二级表：this.details[0].columns.forEach
      //三级表：this.subDetails[0].columns.forEach
      //0表示第幾張表,其他操作不變按下面的配置

      //配置編輯表單下拉框table搜索選項
      this.columns.forEach((item) => {
        if (item.field == 'code') {
          item.readonly = false
          item.edit.type = 'selectTable'
          //配置請求的接口地址
          //可以使用生成的頁面接口，注意接口權限問題，如果提示没有權限,參照後台後開發文檔上的重寫權限示例
          //item.url = 'api/Demo_Goods/getPageData';

          //儘量自定義接口，見下面的文檔描述，或者Demo_GoodsController類的方法Search
          item.url = 'api/Demo_Goods/search'

          //輸入框只讀操作，需要將columns的search字段設置為true，否則無法過濾數據
          //item.inputReadonly=true;
          //設置顯示的字段
          item.columns = [
            { field: 'GoodsName', title: '商品名稱', type: 'string', width: 120, search: false },
            { field: 'GoodsCode', title: '商品編號', type: 'string', width: 100, search: false },
            { field: 'Specs', title: '規格', type: 'string', width: 60, align: 'left' },
            { field: 'Price', title: '單價', type: 'decimal', width: 60 },
            { field: 'Remark', title: '備註', type: 'string', width: 100 }
          ]

          //選中table數據後，回寫到表單
          //editRow:當前正在編輯的行
          //rows:選中的行
          item.onSelect = (editRow, rows) => {
            editRow.GoodsName = rows[0].GoodsName
            editRow.GoodsCode = rows[0].GoodsCode
            editRow.Price = rows[0].Price
          }

          /****下面的這些都是可以選配置，上面的是必填的******/

          //(輸入框搜索)表格數據加載前處理
          //editRow:當前正在編輯的行
          //param:請求的參數
          item.loadBefore = (editRow, param, callback) => {
            //loadType=1按回車調用的查詢，loadType=1輸入框變化調用的查詢，loadType=undefined默認頁面加載
            //這裡可以實現只加載回車事件
            // if(params.loadType!=1){
            //     return false;
            // }

            //(上面如果設置了item.inputReaonly，這裡就不能添加表單的值過濾，否則無法顯示數據)
            //方式1、手動設置查詢條件
            // param.wheres.push({
            //       name:"GoodsName",
            //       value:editRow.GoodsName,
            //       displayType:"like"
            // })
            //方式2、给param.value設置值，後台手動處理查詢條件
            //上面設置了inputReadonly後這裡就不用設置了
            param.value = editRow.GoodsName
            callback(true)
          }

          /****************下面這些配置不是必須的**************/
          //表格數據加載後處理
          //editRow:當前正在編輯的行
          //rows:後台返回的數據
          item.loadAfter = (editRow, rows, callback, result) => {
            callback(true)
          }

          //监听輸入框變動與回車事件
          item.onKeyPress = (val, $event, row) => {
            console.log(val)
            if ($event.keyCode == 13) {
              console.log('按了回車')
            }
            //清空值時给其他字段設置值
            // if(!val&&value+''!='0'){
            //     row.xx=null;
            // }
          }
          //設置彈出框高度(默認200)
          item.height = 200
          //設置彈出框寬度(默認500)
          item.selectWidth = 500
          item.textInline = true //設置表格超出顯示...
          //設置表格是否單選
          item.single = true
          //隐藏分頁
          item.paginationHide = true
        }
      })
    },
    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
      return true
    },
    addBefore(formData) {
      //新建保存前formData為對象，包括明细表，可以给给表單設置值，自己輸出看formData的值
      return true
    },
    updateBefore(formData) {
      //編輯保存前formData為對象，包括明细表、删除行的Id
      return true
    },
    rowClick({ row, column, event }) {
      //查詢界面點擊行事件
      // this.$refs.table.$refs.table.toggleRowSelection(row); //單擊行時選中當前行;
    },
    modelOpenAfter(row) {
      //點擊編輯、新建按鈕彈出框後，可以在此處寫邏輯，如，從後台獲取數據
      //(1)判斷是編輯還是新建操作： this.currentAction=='Add';
      //(2)给彈出框設置默認值
      //(3)this.editFormFields.字段='xxx';
      //如果需要给下拉框設置默認值，請遍歷this.editFormOptions找到字段配置對應data屬性的key值
      //看不懂就把輸出看：console.log(this.editFormOptions)
    }
  }
}
export default extension
