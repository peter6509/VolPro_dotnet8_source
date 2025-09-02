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
  text:"注：業務分庫請按文檔配置,此處為動態無限自動分庫功能",
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
     //下面這些方法可以保留也可以删除
    onInit() {  //框架初始化配置前，
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

        this.columns.push({
          title: '操作',
          hidden: false,
          align: "center",
          fixed: 'right',
          width: 120,
          render: (h, { row, column, index }) => {
              return h(
                  "div", { style: { 'font-size': '13px', 'cursor': 'pointer', 'color': '#409eff' } }, [
                  h(
                      "a", {
                      style: {},
                      onClick: (e) => {
                          e.stopPropagation();
                          if (!row.DbIpAddress||!row.DatabaseName||!row.UserId) {//||!row.Pwd
                             this.$message.error('請填寫：數據庫IP、數據庫名、帳號、密碼');
                             return;
                          }
                          const url='api/Sys_DbService/createDb?id='+row.DbServiceId
                          this.http.post(url,{},true).then(result=>{
                             if (result.status) {
                              this.$message.success('創建成功')
                              return;
                             }
                             this.$message.error(result.message)
                          })
                         
                      }
                  },
                      "創建數據庫"
                  ),
              ])
          }
      })
    },
    onInited() {
      //框架初始化配置後
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
    },
    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
      return true;
    },
    searchAfter(result) {
      //查詢後，result返回的查詢數據,可以在顯示到表格前處理表格的值
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
