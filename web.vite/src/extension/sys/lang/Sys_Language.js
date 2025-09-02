// author:jxx
// 此處是對表單的方法，组件，權限操作按鈕等進行任意擴展(方法擴展可參照SellOrder.js)
let extension = {
  components: {
      // 動態擴充组件或组件路徑
      // 表單header、content、footer對應位置擴充的组件
      gridHeader: '', // { template: "<div>擴展组xx件</div>" },
      gridBody: '',
      gridFooter: '',
      // 彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
      modelHeader: '',
      modelBody: '',
      modelFooter: ''
  },
  text: '',
  buttons: {
      view: [
          {
              name: '生成語言包',
              icon: 'el-icon-plus',
              index: 1,
              type: 'primary',
              plain:true,
              onClick: function () {
                  this.createLanguagePack()
              }
          }
      ],
      box: [],
      detail: []
  }, // 擴展的按鈕
  methods: {
      destroyed () {
      },
      // 事件擴展
      onInit () {
          this.labelWidth = 140
          this.maxBtnLength = 10
          this.boxOptions.height = 300
          this.textInline = false
          this.continueAdd = true;

      },
      onInited () {

      },
      createLanguagePack () {
          this.http
              .get('/api/Sys_Language/createLanguagePack', {}, true)
              .then(x => {
                  this.$Message[x.status ? 'info' : 'error'](this.$ts(x.message))
              })
      },
      searchAfter (result) {
          // 查詢ViewGird表數據後param查詢參數,result回返查詢的结果
          //   this.testList = { recordset: result };
          return true
      },
      modelOpenAfter (row) {
          if (this.currentAction == this.const.ADD) {
              this.editFormFields.IsPackageContent = "1";
          }
      }
  }
}
export default extension
