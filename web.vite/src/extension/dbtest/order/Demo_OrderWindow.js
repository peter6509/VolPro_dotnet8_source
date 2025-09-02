/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼

let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: '',
    //自定義列表頁面
    gridBody: '',
    gridFooter: '',
    //新建、編輯彈出框擴展组件
    modelHeader: modelHeader,
    modelBody: '',
    modelFooter: ''
  },
  text: '', //界面上的提示文字
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    searchAfter(result) {
      //2、查詢後方法，調用自定義列表設置值

      return true;
    },
    //下面這些方法可以保留也可以删除
    onInit() {},
    onInited() {},

    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
      return true;
    },

    addBefore(formData) {
      //新建保存前formData為對象，包括明细表，可以给给表單設置值，自己輸出看formData的值
      return true;
    },
    updateBefore(formData) {
      //編輯保存前formData為對象，包括明细表、删除行的Id
      return true;
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
};
export default extension;
