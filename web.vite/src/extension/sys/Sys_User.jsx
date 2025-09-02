import { defineAsyncComponent } from 'vue'
let extension = {
  components: {
    //動態擴充组件或组件路徑
    //表單header、content、footer對應位置擴充的组件
    gridHeader: defineAsyncComponent(() => import('./Sys_User/Sys_UserGridHeader.vue')),
    gridBody: '',
    gridFooter: '',
    //彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  text: '',
  buttons: [], //擴展的按鈕
  methods: {
    initImg() {
      //自定義圖片顯示位置
      //代碼生成器配置：
      //1、將圖片字段編輯行放在第一行，
      //2、第二、三行的編輯字段數量應该比第一行字段少一個,如：第一行設置了5個編輯字段，第二、三行的字段編輯字段只應配置4個
      const option = this.getFormOption('HeadImageUrl')
      if (option) {
        //通過css控制圖片顯示位置
        option.itemStyle = 'position: absolute;right: 20px;'
        //控制上傳圖片大小
        option.imgOption = {
          icon: 'el-icon-camera-solid',
          iconSize: 60,
          height: 160, //圖片高度
          width: 160 //圖片寬度
        }
        this.boxOptions.width = 650
        if (this.$global.labelPosition=='left') {
          option.imgOption.height=125;
          option.imgOption.width=110
          this.boxOptions.width = 800
        }
        //指定彈出框寬度
      
      }
    },
    //事件擴展
    onInit() {
      //初始化頭像配置
      this.initImg()

      let hasPwd = this.buttons.some((x) => {
        return x.value == 'Add' || x.value == 'Update'
      })

      let hasDel = this.buttons.some((x) => {
        return x.value == 'Delete'
      })

      this.columns.push({
        title: '在線狀態',
        align: 'center',
        //fixed: 'right',
        width: 90,
        render: (h, { row, column, index }) => {
          return h(
            <div style={{ 'font-size': '13px' }}>
              <span
                style={{
                  'border-radius': '50%',
                  height: '8px',
                  width: '8px',
                  display: 'inline-block',
                  'margin-right': '5px',
                  background: row.IsOnline ? '#01dc0a' : '#bdbdbd'
                }}
              ></span>
              {this.$ts(row.IsOnline ? '在線' : '離線')}
            </div>
          )
        }
      })

      this.useAuth = false
      this.columns.push({
        title: '操作',
        hidden: false,
        align: 'center',
        fixed: 'right',
        width: 120 + (this.useAuth ? 40 : 0),
        render: (h, { row, column, index }) => {
          return h(
            <div>
              {hasPwd ? (
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content={this.$ts('强制下線')}
                  placement="top"
                >
                  <el-button
                    type="danger"
                    link
                    disabled={row.IsOnline == 0}
                    onClick={($e) => {
                      this.offLine(row)
                    }}
                    icon="SwitchButton"
                  ></el-button>
                </el-tooltip>
              ) : (
                ''
              )}
              {this.useAuth ? (
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content={this.$ts('用户權限')}
                  placement="top"
                >
                  <el-button
                    type="success"
                    link
                    onClick={($e) => {
                      this.$refs.gridHeader.openAuth(row)
                    }}
                    icon="User"
                  ></el-button>
                </el-tooltip>
              ) : (
                ''
              )}
              {hasPwd ? (
                <el-button
                  onClick={($e) => {
                    this.$refs.gridHeader.open(row)
                  }}
                  type="primary"
                  link
                  icon="Unlock"
                ></el-button>
              ) : (
                ''
              )}
              <el-button
                onClick={($e) => {
                  this.edit(row)
                }}
                type="success"
                link
                icon="Edit"
              ></el-button>
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
    offLine(row) {
      this.$confirm(
        this.$tst('確定要强制用户【{$ts}】下線吗?', row.UserTrueName),
        this.$ts('提示'),
        {
          confirmButtonText: this.$ts('確定'),
          cancelButtonText: this.$ts('取消'),
          'show-cancel-button': true,
          center: true,
          callback: (action) => {
            if (action == 'confirm') {
              this.loginout(row)
            }
          }
        }
      )
    },
    loginout(row) {
      const url = 'api/signalRUser/loginout?userName=' + row.UserName
      this.http.get(url, {}, true).then((result) => {
        this.$message.success(result)
        row.IsOnline = 0
      })
    },
    onInited() {},
    searchAfter(rows, result) {
      this.useAuth = result.extra
      return true
    },
    addAfter(result) {
      //用户新建後，顯示隨機生成的密碼
      if (!result.status) {
        return true
      }
      //顯示新建用户的密碼
      //2020.08.28優化新建成後提示方式
      this.$confirm(result.message,  this.$ts('新建用户成功'), {
        confirmButtonText: this.$ts('確定'),
        cancelButtonText: this.$ts('取消'),
        type: 'success',
        center: true
      }).then(() => {})

      this.boxModel = false
      this.refresh()
      return false
    },
    modelOpenAfter() {
      //點擊彈出框後，如果是編輯狀態，禁止編輯用户名，如果新建狀態，將用户名字段設置為可編輯
      let isEDIT = this.currentAction == this.const.EDIT
      this.editFormOptions.forEach((item) => {
        item.forEach((x) => {
          if (x.field == 'UserName') {
            x.disabled = isEDIT
          }
        })
        //不是新建，性别默認值設置為男
        if (!isEDIT) {
          this.editFormFields.Gender = '0'
        }
      })
    }
  }
}
export default extension
