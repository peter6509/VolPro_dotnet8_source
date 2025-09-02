import { h, resolveComponent } from 'vue'
let extension = {
  components: {
    //動態擴充组件或组件路徑
    //表單header、content、footer對應位置擴充的组件
    //擴展组件引入方式
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  buttons: [], //擴展的按鈕
  text: '',
  methods: {
    detailSortEnd(rows, newIndex, oldIndex, table) {
      let orderNo = rows.length * 10
      rows.forEach((x) => {
        orderNo = orderNo - 10
        x.OrderNo = orderNo
      })
    },
    //事件擴展
    onInit() {
      this.text = '表單、表格數據字典維護'

      this.detailOptions.sortable = true

      this.getFormOption('DbSql').placeholder =
        '如果從數據庫加載數據源，請按此格式配置sql語句：select orderType as key,orderName as value from order  如果需要根據用户信息加載數據源，請配置好此sql,再修改後台DictionaryHandler.cs類GetCustomDBSql方法'

      this.detailOptions.columns.forEach((x) => {
        if (x.field == 'OrderNo') {
          x.summary = true
        }
      })
      //保存後不關閉編輯框
      this.continueAdd = true

      this.paginationHide = true
      this.lazy = false
      this.defaultExpandAll = true
      //樹形结點的id字段
      this.rowKey = 'Dic_ID'
      //父级id字段
      this.rowParentField = 'ParentId'

      this.columns.forEach((x) => {
        if (x.field == 'ParentId' || x.field == 'OrderNo') {
          x.hidden = true
        }
      })
      this.initTableButtons()
      const parentOption = this.getFormOption('ParentId')

      parentOption.required = false
      parentOption.type = 'cascader'
      parentOption.changeOnSelect = true
      parentOption.data = []
      parentOption.orginData = []

      //是否展開所有節點（默認會記錄展開的節點）
      //this.defaultExpandAll=true;

      //默認展開的節點
      // this.expandRowKeys=["id"]

 
    },
    getParentOption() {
      return this.getFormOption('ParentId') || { data: [] }
    },
    onInited() {
      this.detailOptions.pagination.sortName = "OrderNo,CreateDate";  //明细表排序字字段
      this.detailOptions.pagination.order = "desc" ; //明细表排序方式desc或者asc
      this.detailOptions.columns.forEach((x) => {
        if (x.field == 'OrderNo') {
          x.tip = {
            text: '數據源按從大到小降序排序,值越大越靠前顯示'
          }
        }
      })
     // this.detailOptions.height = this.detailOptions.height - 50
      // this.height = this.height - 45

      this.boxOptions.width=1200;
    },
    addBefore(formData) {
      return this.saveBefore(formData)
    },
    updateBefore(formData) {
      return this.saveBefore(formData)
    },
    modelOpenAfter() {
      this.initParentData()
    },
    searchAfter(rows) {
      this.rows = rows.map((x) => {
        return {
          id: x.Dic_ID,
          key: x.Dic_ID,
          label: x.DicName,
          value: x.Dic_ID,
          parentId: x.ParentId
        }
      })
      return true
    },
    addBtnClick(row) {
      //這裡是動態addCurrnetRow屬性記錄當前點擊的行數據,下面modelOpenAfter設置默認值
      this.addCurrnetRow = row
      this.add()
    },
    initParentData(rows) {
      let data = this.rows
      const option = this.getFormOption('ParentId')
      option.orginData = data
      const treeData = this.base.convertTree(
        JSON.parse(JSON.stringify(data)),
        (node, item, isRoot) => {}
      )
      option.data = treeData
    },
    initTableButtons() {
      let hasUpdate, hasDel, hasAdd
      this.buttons.forEach((x) => {
        if (x.value == 'Update') {
          x.hidden = true
          hasUpdate = true
        } else if (x.value == 'Delete') {
          hasDel = true
          x.hidden = true //隐藏按鈕
        } else if (x.value == 'Add') {
          x.type = 'primary'
          hasAdd = true
        }
      })
      if (!(hasUpdate || hasDel || hasAdd)) {
        return
      }
      this.columns.push({
        title: '操作',
        field: '操作',
        width: 100,
        fixed: 'right',
        align: 'center',
        render: (h, { row, column, index }) => {
          return (
            <div>
              {hasAdd ? (
                <el-button
                  onClick={($e) => {
                    this.addBtnClick(row)
                  }}
                  type="primary"
                  link
                  icon="Plus"
                ></el-button>
              ) : (
                ''
              )}
              {hasUpdate ? (
                <el-button
                  onClick={($e) => {
                    this.edit(row)
                  }}
                  type="success"
                  link
                  icon="Edit"
                ></el-button>
              ) : (
                ''
              )}
              {hasDel ? (
                <el-button
                  link
                  onClick={($e) => {
                    this.del(row)
                  }}
                  type="danger"
                  icon="Delete"
                ></el-button>
              ) : (
                ''
              )}
            </div>
          )
        }
      })
    },
    updateAfter() {
      this.initParentData()
      return true
    },
    addAfter() {
      this.initParentData()
      return true
    },
    saveBefore(formData) {
      if (!formData.mainData.ParentId) {
        formData.mainData.ParentId = 0
      } else {
        formData.mainData.ParentId = (formData.mainData.ParentId + '').split(',').pop()
      }
      if (
        this.editFormFields.DbSql &&
        (this.editFormFields.DbSql.indexOf('value') == -1 ||
          this.editFormFields.DbSql.indexOf('key') == -1)
      ) {
        this.$message.error(
          'sql語句必須包括key/value字段,如:select orderType as key,orderName as value from order'
        )
        return false
      }
      return true
    }
  }
}
export default extension
