/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼

import gridHeader from './Demo_OrderTabsGridHeader.vue'
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: gridHeader,
    //自定義列表頁面
    gridBody: '',
    gridFooter: '',
    //新建、編輯彈出框擴展组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  text: '', //界面上的提示文字
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  methods: {
    onInit() {
      //這裡可以設置默認不加載數據，通過gridHeader内調用接口獲取信息後再加載數據
      // this.load=false;
      
      //自定義合計顯示格式
      this.columns.forEach((x) => {
        if (x.field == 'TotalPrice') {
          x.summary = true
          x.align = 'center'
          x.width = 80
          x.summaryFormatter = (val, column, result, summaryData) => {
            if (!val) {
              return '0.00'
            }
            summaryData[0] = '匯總'
            return (
              '￥' + (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') //+ '元'
            )
          }
          //計算平均值
          //x.summary = 'avg';//2023.05.03更新voltable文件後才能使用
          //設置小數顯示位數(默認2位)
          // x.numberLength = 4;
        }
      })
    },
    onInited() {
      //這裡一定要設置table顯示高度减去gridHeader的高度，否則會出現兩個滾動條
      this.height = this.height - 45
    },
    delAfter() { //删除、新建、編輯後刷新tabs數據
      return this.reloadData()
    },
    updateAfter() {
      return this.reloadData()
    },
    addAfter() {
      return this.reloadData()
    },
    reloadData() {
      this.$refs.gridHeader.initData();
      return true
    }
  }
}
export default extension
