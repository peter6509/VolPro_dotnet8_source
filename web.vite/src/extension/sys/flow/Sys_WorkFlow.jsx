/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import gridHader from './Sys_WorkFlow/WorkFlowGridHeader.vue';
import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: gridHader,
    gridBody: {
      render() {
        return [
          h(
            resolveComponent('el-alert'),
            {
              style: { 'margin-bottom': '12px' },
              'show-icon': true,
              type: 'success',
              closable: false,
              title: '流程設計器根據easy-flow修改,表必須包括審批字段AuditStatus,具體見示例表SellOrder;後台startup需要注入審批流程'
            },
            ''
          )
        ];
      }
    },
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
      this.height = this.height - 50;
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
    async modelOpenBeforeAsync(row) {
      //點擊編輯/新建按鈕彈出框前，可以在此處寫邏輯，如，從後台獲取數據
      this.$refs.gridHeader.open(row);
      return false;
    }
  }
};
export default extension;
