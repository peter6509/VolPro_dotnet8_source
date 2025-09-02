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
  tableAction: 'Demo_Catalog', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    //下面這些方法可以保留也可以删除
    onInit() {
      // this.gridRender = {
      //   data: {
      //     value1: '-1', //默認值下面v-model需要使用
      //     value2: '1',
      //     data: [] //聲明默認值，下面item.data使用
      //   },
      //   h: (h, { item }) => {
      //     //這裡也可以從後台返回數據，
      //     // this.http.post('url', {}).then((x) => {
      //     item.data = [
      //       { key: '-1', value: '全部' },
      //       { key: '1', value: '成功' },
      //       { key: '0', value: '異常' }
      //     ]
      //     // })

      //     //這裡要什麼就寫什麼標簽
      //     return (
      //       <div style="position: relative;bottom: -6px;">
      //         <el-radio-group
      //           size="small"
      //           style="margin-left:15px;"
      //           v-model={item.value1}
      //           onChange={(v) => {
      //             this.$message.success(item.value1)
      //           }}
      //         >
      //           {item.data.map((c) => {
      //             return <el-radio-button label={c.key}>{c.value}</el-radio-button>
      //             // <el-radio  label={c.key}>{c.value}</el-radio>
      //           })}
      //         </el-radio-group>

      //         {/* <el-select
      //           style="width:120px;margin-left:15px;"
      //           v-model={item.value2}
      //           onChange={(v) => {
      //             this.$message.success(item.value2)
      //           }}
      //         >
      //           {item.data.map((c) => {
      //             return <el-option key={c.key} label={c.value} value={c.key} />
      //           })}
      //         </el-select> */}
      //       </div>
      //     )
      //   }
      // }

      //示例：設置修改新建、編輯彈出框字段標籤的長度
      // this.boxOptions.labelWidth = 150;
      //顯示所有查詢條件
      this.setFiexdSearchForm(true)

      //設置主鍵字段
      this.rowKey = 'CatalogId'
    },
    dicInited(params) {
      //數據源加載完成時的方法,2022.04.04更新method.js文件後才能使用
    },
    onInited() {
      // this.height = this.height - 76
      //框架初始化配置後
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
      // this.boxOptions.height = 390

      //選項卡頁面减去tabs高度
      if (this.$route.path == '/tabs') {
        this.height = this.height - 115
      }
    },
    /***加載後台數據見Demo_CatalogController.cs文件***/
    loadTreeChildren(tree, treeNode, resolve) {
      //加載子節點
      let url = `api/Demo_Catalog/getChildrenData?catalogId=${tree.CatalogId}`
      this.http.post(url, {}).then((result) => {
        resolve(result.rows)
      })
    },
    /***加載後台數據見Demo_CatalogController.cs文件***/
    searchBefore(params) {
      //查詢前的方法，如果没有輸入查詢條件，默認顯示一级節點的數據
      if (params.wheres.length == 0) {
        params.value = 1
      }
      return true
    },
    addAfter() {
      //新建後刷新下级聯的數據字典
      this.initDicKeys()
      return true
    },
    updateAfter() {
      //編輯後刷新下级聯的數據字典
      this.initDicKeys()
      return true
    },
    delAfter() {
      //删除後刷新下级聯的數據字典
      this.initDicKeys()
      return true
    }
  }
}
export default extension
