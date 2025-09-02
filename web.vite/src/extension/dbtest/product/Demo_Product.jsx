//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import { h, resolveComponent } from 'vue'

import gridHeader from './Demo_Product/Demo_ProductGridHeader.vue'
import gridFooter from './Demo_Product/Demo_ProductGridFooter.vue'
import modelBody from './Demo_Product/Demo_ProductModelBody.vue'

let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: gridHeader,
    gridBody: {
      render() {
        return [
          h(
            resolveComponent('el-alert'),
            {
              style: { 'margin-bottom': '5px' },
              'show-icon': true,
              type: 'success',
              closable: false,
              title: '一對多(支持多個二级明细與三级明细表)零代碼全自動生成,點擊新建或編輯查看...'
            },
            ''
          )
        ]
      }
    },
    gridFooter: gridFooter,
    //新建、編輯彈出框擴展组件
    modelHeader: '',
    modelBody: modelBody,
    modelFooter: ''
  },
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  text: '更快、更高效。。。',
  methods: {
    initAuditColumn(){
      
    },
    //下面這些方法可以保留也可以删除
    btn2Click(row, column, index, $e) {
      $e.stopPropagation()
      this.$message.success('點擊按鈕')
    },
    btn1Click(row, column, index, $e) {
      $e.stopPropagation()
      this.$message.success('點擊按鈕')
      //可以直接調用編輯
      //this.edit(row)
    },
    dropdownClick(value, row, column, index, $e) {
      $e.stopPropagation()
      this.$message.success('點擊按鈕组:' + value)
    },

    priceBtnClick(btnIndex, row, column, index, $e) {
      $e.stopPropagation()
      this.$message.success('點擊了第' + btnIndex + '個圖標')
    },
    onInited() {
      this.editFormOptions.forEach((x) => {
        x.forEach((ops) => {
          //"ProductName","ProductCode","Price","Remark","Creator","CreateDate","Modifier","ModifyDate"
          if (['ProductName', 'ProductCode', 'Price', 'Remark'].indexOf(ops.field) != -1) {
            ops.group = '基礎信息'
          } else if (['Creator', 'CreateDate', 'Modifier', 'ModifyDate'].indexOf(ops.field) != -1) {
            ops.group = '系统信息'
          }
        })
      })

      this.showCustom=false;
      this.maxBtnLength=6;
      this.height = this.height / 2 // 300;

      //設置主表合計
      this.summary = true
      //如果有明细表,設置明细表合計
      // this.detailOptions.summary = true;

      //設置主表求字段，後台需要實現SummaryExpress方法
      this.columns.forEach((x) => {
        if (x.field == 'Price') {
          x.summary = true
          x.align = 'center'
          x.width = 120
          x.summaryFormatter = (val, column, result, summaryData) => {
            if (!val) {
              return '0.00'
            }
            summaryData[0] = '匯總'
            return '￥' + (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '元'
          }
          //計算平均值
          //x.summary = 'avg';//2023.05.03更新voltable文件後才能使用
          //設置小數顯示位數(默認2位)
          // x.numberLength = 4;
        }
      })

      //可以通過this.buttons判斷有没有某些按鈕權限，如果有再添加自定義按鈕

      if (
        this.buttons.some((x) => {
          return x.value === 'Add'
        })
      ) {
        //splice在第三個按鈕後面添加一個按鈕
        this.buttons.splice(3, 0, {
          name: '自定義按鈕', //按鈕名稱
          icon: 'el-icon-document', //按鈕圖標https://element.eleme.cn/#/zh-CN/component/icon
          type: 'primary', //按鈕樣式vue2版本見iview文檔button，vue3版本見element ui文檔button
          plain: true,
          onClick: function () {
            this.$message.success('點擊了按鈕')
          }
        })
      }

      this.buttons.splice(3, 0, {
        name: '彈出框1', //按鈕名稱
        icon: 'el-icon-document', //按鈕圖標https://element.eleme.cn/#/zh-CN/component/icon
        type: 'primary', //按鈕樣式vue2版本見iview文檔button，vue3版本見element ui文檔button
        plain: true,
        onClick: function () {
          let rows = this.getSelectRows()
          if (!rows.length) {
            return this.$message.error('請選中行數據')
          }
          this.$refs.gridHeader.openModel1(rows)
        }
      })

      //splice在第三個按鈕後面添加一個按鈕

      let index = this.columns.findIndex((x) => {
        return x.field == 'Remark'
      })

      this.columns.splice(index, 0, {
        title: '按鈕', //按鈕名稱
        field: '按鈕',
        align: 'center',
        render: (h, { row, column, index }) => {
          return (
            <div>
              <el-button
                onClick={($e) => {
                  $e.stopPropagation()
                  this.$refs.gridHeader.openModel2(row, column, index)
                }}
                style=" height:23px;padding: 0px 8px !important;"
                size="small"
                type="primary"
                plain
              >
                彈出框2
              </el-button>
            </div>
          )
        }
      })

      //價格按鈕前面增加按鈕，onClick
      this.columns.find((x) => {
        return x.field == 'Price'
      }).render = (h, { row, column, index }) => {
        return (
          <div>
            <i
              onClick={($e) => {
                this.priceBtnClick(1, row, column, index, $e)
              }}
              class="el-icon-search"
              style="color: #2196F3;cursor: pointer;"
            ></i>
            <i
              onClick={($e) => {
                this.priceBtnClick(2, row, column, index, $e)
              }}
              class="el-icon-date"
              style="margin-left:6px;color: #2196F3;cursor: pointer;"
            ></i>
            <span style="margin-left:5px">{row.Price}</span>
          </div>
        )
      }

      //表格上添加自定義按鈕
      this.columns.push({
        title: '操作',
        field: '操作',
        width: 150,
        align: 'left', // 'center',
        render: (h, { row, column, index }) => {
          return (
            <div>
              <el-button
                onClick={($e) => {
                  this.btn1Click(row, column, index, $e)
                }}
                type="primary"
                plain
                style="height:26px; padding: 10px !important;"
              >
                查看
              </el-button>

              {/* 通過條件判斷,要顯示的按鈕 */}
              {/*  {
                      index % 2 === 1 
                      ?<el-button>修改</el-button>
                      : <el-button>設置</el-button>
                  } */}

              {/* 通過v-show控制按鈕隐藏與顯示
                下面的index % 2 === 1換成：row.字段==值 */}
              <el-button
                onClick={($e) => {
                  this.btn2Click(row, $e)
                }}
                v-show={index % 2 === 1}
                type="success"
                plain
                style="height:26px;padding: 10px !important;"
              >
                修改
              </el-button>

              <el-button
                onClick={($e) => {
                  this.btn2Click(row, $e)
                }}
                v-show={index % 2 === 0}
                type="warning"
                plain
                style="height:26px;padding: 10px !important;"
              >
                設置
              </el-button>

              <el-dropdown
                trigger="click"
                v-slots={{
                  dropdown: () => (
                    ////這裡也可以改為循環設置下按鈕，其他按鈕一樣，使用map循環
                    // [
                    //   { name: "京醬肉絲", value: "1" },
                    //   { name: "驢肉火燒", value: "2" }
                    // ].map(x => {
                    //   return <a>{x.name}</a>
                    // })
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <div
                          onClick={($e) => {
                            this.dropdownClick('京醬肉絲', row, column, index, $e)
                          }}
                        >
                          京醬肉絲
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div
                          onClick={($e) => {
                            this.dropdownClick('驢肉火燒', row, column, index, $e)
                          }}
                        >
                          驢肉火燒
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  )
                }}
              >
                <span
                  style="font-size: 13px;color: #409eff;margin: 5px 0 0 10px;"
                  class="el-dropdown-link"
                >
                  更多<i class="el-icon-arrow-right"></i>
                </span>
              </el-dropdown>
            </div>
          )
        }
      })
    },
    onInit() {
      this.columns.forEach((x) => {
        if (x.field == 'Modifier' || x.field == 'ModifyDate') {
          x.hidden = true
        }
      })

      //明细表導入
      this.details[0].buttons.unshift({
        type: 'danger',
        plain: true,
        name: '導入',
        value: 'import',
        hidden: false,
        icon: 'el-icon-upload2',
        onClick: () => {
          this.upload.url = `${this.http.ipAddress}api/Demo_ProductColor/${this.const.IMPORT}?table=1`
          this.upload.template.url = `${this.http.ipAddress}api/Demo_ProductColor/${this.const.DOWNLOADTEMPLATE}`
          //定義下載模板的文件名
          this.upload.template.fileName = '文件名'
          this.detailOptions.cnName = '導入標題'
          this.upload.excel = true
        }
      })
    },
    importAfter(data) {
      this.getTable('Demo_ProductColor').rowData.unshift(...data.data)
      return false
    },
    //設置明细表數據源顯示與隐藏
    setDetailData(value, souce) {
      //找到第一個明细表Unit的數據源， this.details對象可以調試輸出看，也可以直接生成的vue文件裡面的details對象
      const binData = this.details[0].columns.find((c) => {
        return c.field == 'Unit'
      }).bind.data
      //循環數據源，滿足條件的就顯示，不滿足的就隐藏
      binData.forEach((detail) => {
        //方式一：主表下拉框選中值=1時，隐藏明细表數據源key=='件的數據'，其他的顯示出來
        if (value == '1') {
          detail.hidden = detail.key == '件'
        } else if (value == '0') {
          detail.hidden = detail.key == '條'
        }
        //方式二：上面只是舉例，實際情况明细表的數據源自定義sql，可以返回一個標識屬於哪個分组
        //如：select xx1 as key,xx2 as value,'10000' as groupValue from table

        //分组標識數據源屬於分類，這樣就可以批量設置數據源顯示與隐藏
        //上面的數據源聯動可以改為:
        // 主表下拉框選中值=1時
        // if (value == "1") {
        //   detail.hidden = detail.groupValue == '10000'
        // } else if (value == "0") {
        //   detail.hidden =  detail.groupValue == '10010'
        // }
      })

      //方式三：從後台返回要顯示的數據源的key
      // let url = 'api/xx/getData?value=' + value;
      // this.http.get(url, {}, false).then(keys => {
      //   //從後台返回明细表Unit字段的數據源的key
      //   binData.forEach(c => {
      //     //返回的keys在明细表數據源中存在就顯示
      //     c.hidden = keys.indexOf(c.key) == -1
      //   })
      // })
    },
    searchDetailBefore(param, table, item) {
      //明细表查詢前方法

      return true
    },
    searchDetailAfter(data, table, item) {
      //明细表查詢後方法
      return true
    },
    modelOpenAfter() {
      //彈出框打開後方法，為編輯時，設置明细表默認下拉框的數據源
      if (this.currentAction == 'Update') {
        this.setDetailData(this.editFormFields.Unit)
      }
    },

    searchAfter(result) {
      //查詢後，清空原來記錄選中行的id
      // this.$store.getters.data().ProductId = null;
      return true
    },
    //操作步驟1：主表點擊事件加載明细數據
    rowClick({ row, column, event }) {
      //點擊主表table行數據，加載主界面下面的兩個table數據
      //vuex
      //缓存當前選中行的主鍵id
      this.$store.getters.data().ProductId = row.ProductId

      //清除原來選中的行
      this.$refs.table.$refs.table.clearSelection()

      //查詢界面點擊行事件
      this.$refs.table.$refs.table.toggleRowSelection(row, true) //單擊行時選中當前行;

      //調用下面選項卡的查詢
      //見Demo_ProductGridFooter.vue文件rowClick方法
      this.$refs.gridFooter.rowClick(row)
    }
  }
}
export default extension
