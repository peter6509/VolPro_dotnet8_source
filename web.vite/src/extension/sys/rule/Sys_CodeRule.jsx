/*****************************************************************************************
 **  Author:jxx 2023
 **  QQ:283591387
 **  框架文檔： http://doc.volcore.xyz/
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
    modelRight: '',
    modelFooter: ''
  },
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    //下面這些方法可以保留也可以删除
    onInit() {
      const tableOption = this.getFormOption('TableName')
      tableOption.type = 'select'
      tableOption.required = true
      tableOption.data = []
      tableOption.onChange = (val) => {
        this.editFormFields.TableCNName = tableOption.data.find((x) => {
          return x.key == val
        }).value
        this.editFormFields.Field="";
        this.editFormFields.OrderFiled="";
        this.getTableFields()
      }

      //前缀
      this.getFormOption('PrefixCode').required = true

      const ruleOption = this.getFormOption('RuleType')
      ruleOption.type = 'radio'
      ruleOption.data = [
        { key: 'yyyy', value: '年' },
        { key: 'yyyyMM', value: '年月' },
        { key: 'yyyyMMdd', value: '年月日' }
        // { key: 'year', value: '編號每年從1開始自增' },
        // { key: 'none', value: '編號累計自增' }
      ]
      ruleOption.onChange = () => {
        this.initViewCode()
      }

      const ruleIncrementalOption = this.getFormOption('RuleIncremental')
      ruleIncrementalOption.required = true
      ruleIncrementalOption.type = 'select'
      ruleIncrementalOption.data = [
        { key: 'day', value: '編號每天從1開始自增' },
        { key: 'month', value: '編號每月從1開始自增' },
        { key: 'year', value: '編號每年從1開始自增' },
        { key: 'none', value: '編號累計自增' }
      ]
      ruleIncrementalOption.onChange = () => {
        this.initViewCode()
      }

      const lenOption = this.getFormOption('ValueLen')
      lenOption.min = 2
      lenOption.max = 20
      lenOption.onKeyPress = () => {
        this.initViewCode()
      }

      const fieldOption = this.getFormOption('Field')
      fieldOption.data = []
      fieldOption.type = 'select'
      fieldOption.required = true
      fieldOption.onChange = (val) => {
        this.editFormFields.CodeText1 = fieldOption.data.find((x) => {
          return x.key == val
        }).value
      }

      const orderFiled = this.getFormOption('OrderFiled')
      orderFiled.data = []
      orderFiled.type = 'select'

      orderFiled.required = true
      orderFiled.onChange = (val) => {
        this.editFormFields.CodeText2 = orderFiled.data.find((x) => {
          return x.key == val
        }).value
      }

      this.columns.forEach((x) => {
        if (x.field == 'Field') {
          x.formatter = (row) => {
            return this.$ts(row.CodeText1) + '(' + row.Field + ')'
          }
        } else if (x.field == 'OrderFiled') {
          x.formatter = (row) => {
            return this.$ts(row.CodeText2) + '(' + row.OrderFiled + ')'
          }
        }
      })

      this.getFormOption('PrefixCode').onKeyPress = () => {
        this.initViewCode()
      }

      this.getFormOption('ConcatenationSymbol').onKeyPress = () => {
        this.initViewCode()
      }

       const codeOption= this.getFormOption("Code");
       codeOption.label=true;
       codeOption.inputStyle={'color':'#0690fe','font-size':'16px','font-weight':'bold','letter-spacing':'1px'}
    },
    onInited() {},
    initViewCode() {
      setTimeout(() => {
        let code = []
        code.push(this.editFormFields.PrefixCode || 'P')
        let date = this.base.getDate().replace(/-/g, '')
        if (this.editFormFields.RuleType == 'yyyy') {
          code.push(date.substring(0, 4))
        } else if (this.editFormFields.RuleType == 'yyyyMM') {
          code.push(date.substring(0, 6))
        } else {
          code.push(date.substring(0, 8))
        }
        code.push(String(1).padStart(this.editFormFields.ValueLen, '0'))

        this.editFormFields.Code = code.join(this.editFormFields.ConcatenationSymbol || '')
      }, 100)
    },
    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
      return true
    },
    searchAfter(result) {
      //查詢後，result返回的查詢數據,可以在顯示到表格前處理表格的值
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
    modelOpenBefore() {
      const tableOption = this.getFormOption('TableName')
      if (tableOption.data.length) {
        return
      }
      let permission = this.$store.getters.getPermission()
      const tables = permission
        .filter((x) => {
          return (
            (!x.children || !x.children.length) &&
            x.tableName &&
            x.tableName.length > 2
          )
        })
        .map((x) => {
          return { key: x.tableName, value: x.name }
        })
      let url = 'api/Sys_CodeRule/getTableInfo'
      let tableArr = tables.map((x) => {
        return x.key
      })
      this.http.post(url, tableArr, false).then((res) => {
        tableOption.data = tables.filter((x) => {
          return res.includes(x.key)
        })
      })
      return true
    },
    getTableFields() {
      let url = 'api/Sys_CodeRule/getFields?table=' + this.editFormFields.TableName
      this.http.get(url).then((x) => {
        this.getFormOption('Field').data = x.filter((c) => {
          return c.columnType == 'string'
        })
        this.getFormOption('OrderFiled').data = x.filter((c) => {
          return c.columnType == 'date' || c.columnType == 'datetime'
        })
      })
    },
    modelOpenAfter(row) {
      if (this.currentAction == 'Add') {
        this.getFormOption('Field').data = []
        this.getFormOption('OrderFiled').data = []
        this.editFormFields.ValueLen = 4
        this.initViewCode()
        return
      }
      this.editFormFields.ValueLen = this.editFormFields.ValueLen * 1
      this.getTableFields()
    }
  }
}
export default extension
