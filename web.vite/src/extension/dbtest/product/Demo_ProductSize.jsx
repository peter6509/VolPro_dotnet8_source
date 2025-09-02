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
    gridBody: '',
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
    onInit() {
      //框架初始化配置前，
      this.tableHeight = 270;

      //一對多左右结構
      if (this.$route.path == '/Demo_Product2') {
        this.load = false;
        this.columns.forEach((x) => {
          if (
            ['Creator', 'Modifier', 'ModifyDate'].indexOf(
              x.field
            ) != -1
          ) {
            x.hidden = true;
          }
        });
      }
      this.showCustom = false;
    },
    onInited() {
      //頁面打開時不加載數據
      if (this.$route.path.indexOf('/Demo_Product') != -1) {
        this.load = false;
        this.buttons.forEach((x) => {
          if (['Add', 'Update', 'Delete'].indexOf(x.value) != -1) {
            x.hidden = false;
          } else {
            x.hidden = true;
          }
        });
      }
      this.singleSearch = null;
    },
    searchBefore(param) {
      //明细表查詢前方法

      //操作步驟3：主表點擊行時,設置查詢條件
      if (this.$route.path.indexOf('/Demo_Product') != -1) {
        //產品管理界面必須選中行數據後才能查詢
        if (!this.$store.getters.data().ProductId) {
          // this.$message.error('請選中產品行數據');
          return false;
        }
        //查詢選中行的數據
        param.wheres.push({
          name: 'ProductId', //查詢字段
          value: this.$store.getters.data().ProductId //查詢值為主表的主鍵id值
        });
      }
      return true;
    },
    addBefore(params) {
      //新建保存前
      //操作步驟5：將主表選行的值添加到明细表中(注意代碼生成器，明细表的ProductId字段必須設置編輯為0，並生成下model)

      params.mainData.ProductId = this.$store.getters.data().ProductId;
      //查詢後，result返回的查詢數據,可以在顯示到表格前處理表格的值
      return true;
    },
    modelOpenBeforeAsync() {
      //操作步驟4：打開彈出框時判斷是否為新建操作，新建時必須让選中行數據

      //新建時產品管理界面必須選中行數據後才能彈出框
      if (this.$route.path == '/Demo_Product') {
        if (this.currentAction == 'Add') {
          if (!this.$store.getters.data().ProductId) {
            this.$message.error('請選中產品行數據');
            return false;
          }
        }
      }
      return true;
    }
  }
};
export default extension;
