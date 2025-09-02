/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import gridFooter from './Demo_OrderGridFooter'
import modelHeader from './orderModelHeader'
import { h, resolveComponent } from 'vue'
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: '',

    //自定義列表頁面
    gridBody: {
      render() {
        return h(
          <el-alert
            show-icon={true}
            closable={false}
            style="margin-bottom:10px"
            type="success"
            title="當前頁面示例：打印、多表頭；彈出框：編輯表單下拉框table搜索、明细表table搜索；具體使用見企業版開發文檔(示例功能->下拉框table)"
          ></el-alert>
        )
      }
    },
    gridFooter: gridFooter,
    //新建、編輯彈出框擴展组件
    modelHeader: modelHeader,
    modelBody: {
      render() {
        return [
          h(
            resolveComponent('el-alert'),
            {
              style: { 'margin-bottom': '12px' },
              'show-icon': true,
              type: 'success',
              closable: false,
              title: '點擊[客户]或明细表[商品名稱]可進行下拉框table搜索(代碼生成器生成後即可使用)'
            },
            ''
          )
        ]
      }
    },
    modelFooter: ''
  },
  text: '', //界面上的提示文字
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    rowClick({ row, column, event }) {
      //查詢界面table點擊行選中當前行
      //取消其他行選中
      this.$refs.table.$refs.table.clearSelection()
      //設置選中當前行
      this.$refs.table.$refs.table.toggleRowSelection(row)

      //調用Demo_OrderGridFooter.vue中明细表table的查詢方法
      if (this.$refs.gridFooter) {
        this.$refs.gridFooter.gridRowClick(row)
      }
    },
    // addRow() {//添加行時，自設置焦點
    //   let row = {}
    //   this.$refs.detail.rowData.push(row)
    //   //要設置獲取焦點的輸入框字段
    //   let column = this.detailOptions.columns.find((x) => {
    //     return x.field == 'Qty'
    //   })
    //   setTimeout(() => {
    //     this.$refs.detail.rowClick(row, column)
    //   }, 300)
    // },
    searchAfter(rows) {
      //2、查詢後方法，調用自定義列表設置值
      //主表查詢加載數據後
      //頁面加載或者刷新數據後直接顯示第一行的明细
      if (rows.length) {
        this.$refs.gridFooter.gridRowClick(rows)
      } else {
        //主表没有數據時，清空明细數據
        this.$refs.gridFooter.clearRows()
      }
      return true
    },
    //下面這些方法可以保留也可以删除
    onInit() {
      //設置表格篩選
      this.columns.forEach((x) => {
        if (x.field == 'OrderNo' || x.field == 'OrderType') {
          x.filterData = true
        }
      })

      this.maxBtnLength = 5
      this.queryFields = ['CreateDate']
      //增加提交審批按鈕
      let index =
        this.buttons.findIndex((x) => {
          return x.value == 'Audit'
        }) + 1

      this.buttons.splice(index, 0, {
        name: '提交',
        icon: 'el-icon-check',
        class: '',
        plain: true,
        type: 'primary',
        onClick: () => {
          let rows = this.getSelectRows()
          if (!rows.length) {
            return this.$message.error('請選擇行數據')
          }
          let ids = rows.map((x) => {
            return x.Order_Id
          })

          this.http.post('api/Demo_Order/submitAudit', ids).then((result) => {
            if (!result.status) {
              this.$message.error(result.message)
              return
            }
            this.$message.success(result.message)
            this.search()
          })
        }
      })

      //示例：設置修改新建、編輯彈出框字段標籤的長度
      // this.boxOptions.labelWidth = 150;
      //彈出框添加選擇數據與倒計時操作操作

      let countdown = 10
      this.editFormOptions.forEach((option) => {
        option.forEach((item) => {
          if (item.field == 'PhoneNo') {
            item.extra = {
              btnValue: '發送短信',
              render: (h, {}) => {
                return (
                  <div>
                    <el-button
                      type="primary"
                      link
                      onClick={() => {
                        //全局狀態記錄參數，用於加載彈出框的數據,這裡只是演示(2022.12.06)
                        this.$store.getters.data().orderId = this.editFormFields.Order_Id
                        this.$refs.modelHeader.open(this.editFormFields)
                      }}
                    >
                      <i class="el-icon-search">選擇</i>
                    </el-button>
                    <el-button
                      type="primary"
                      style="margin-left:0"
                      link
                      onClick={() => {
                        //設置倒計時
                        var timer = setInterval(function () {
                          if (countdown > 0) {
                            item.extra.btnValue = countdown + '(秒)'
                            countdown--
                          } else {
                            item.extra.btnValue = '發送短信'
                            countdown = 10
                            clearInterval(timer)
                          }
                        }, 1000)
                      }}
                    >
                      <i class="el-icon-message">{item.extra.btnValue}</i>
                    </el-button>

                    <el-popover placement="top-start" title="提示" width="200" trigger="hover">
                      {{
                        reference: () => {
                          return (
                            <i
                              style="color:rgb(6 118 169);font-size:12px;margin-left:5px"
                              onClick={() => {
                                this.$message.success('提示信息')
                              }}
                              class="el-icon-warning-outline"
                            ></i>
                          )
                        },
                        default: () => {
                          return (
                            <div style="width:300px">
                              <div style="font-size:12px">觸發 Popover 顯示的 HTML 元素</div>
                              <div style="font-size:12px">觸發 Popover 顯示的 HTML 元素</div>
                            </div>
                          )
                        }
                      }}
                    </el-popover>
                  </div>
                )
              }
            }
          }
        })
      })

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
      //這裡可以重新設置主表表格高度
      this.height = this.height - 160 - 50

      //主表設置表格合計功能
      this.summary = true
      this.columns.forEach((x) => {
        if (x.field == 'TotalQty' || x.field == 'TotalPrice') {
          x.summary = true
        }
      })

      //明细表求和
      this.detailOptions.summary = true
      this.detailOptions.columns.forEach((x) => {
        x.require = false
        if (x.field == 'Price' || x.field == 'Qty') {
          x.summary = true
          //按回車自動跳轉到下一行焦點
          x.onKeyPress = (row, column, $e) => {
            if ($e && $e.keyCode == 13) {
              this.$refs.detail.toNextCell(null, row, 'Qty', true)
            }
          }
        }
      })

      /****注意：明细表合計實時計算给表單設置值，必須先配置【table 顯示合計】文檔示例*****/

      // //明细表實時計算，表單實現計算聯動
      // this.detailOptions.columns.forEach((col) => {
      //   //给數量Qty字段合計自定義顯示格式、同時與表單聯動顯示
      //   if (col.field == 'Qty') {
      //     //value:Qty字段合計的结果
      //     //rows:明细表的全部數據
      //     //summaryArrData:所有合計的全部對象
      //     col.summaryFormatter = (qtyValue, column, rows, summaryArrData) => {
      //       //明细表輸入或者值變化後给表單字段設置值
      //       this.editFormFields.TotalQty = qtyValue;

      //       //這裡的return qtyValue一定要寫上,自定義返回格式,return qtyValue+'件'
      //       return qtyValue + '件';
      //     };
      //   }
      // });

      //明细表合計時表單多個字段設置值(與上面的示例區别在於這裡)
      this.detailOptions.columns.forEach((col) => {
        //给數量Qty字段合計自定義顯示格式、同時與表單聯動顯示
        if (col.field == 'Qty') {
          //value:Qty字段合計的结果
          //rows:明细表的全部數據
          //summaryArrData:所有合計的全部對象
          col.summaryFormatter = (qtyValue, column, rows, summaryArrData) => {
            //明细表輸入或者值變化後给表單字段設置值
            this.editFormFields.TotalQty = qtyValue

            //從明细表rows找到價格字段，手動計算合計
            let priceValue = 0
            rows.forEach((x) => {
              priceValue += x.Price || 0
            })

            //明细表數量字段+價格字段計算结果给總價設置值
            this.editFormFields.TotalPrice = qtyValue * priceValue

            //這裡的return qtyValue一定要寫上,自定義返回格式,return qtyValue+'件'
            return qtyValue + '件'
          }
        }
      })

      this.height = this.height - 45

      this.detailOptions.height = 200

      //框架初始化配置後
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
      //unshift、splice、push
      //批量添加
      this.detailOptions.buttons.unshift(
        ...[
          //按鈕组自定義绑定數據
          {
            inputValue: '', //輸入框绑定的數據
            selectValue: '1',
            selectOptions: [
              { key: '1', value: '選項一' },
              { key: '2', value: '選項二' }
            ],

            name: '輸入框', //按鈕名稱
            render: (h, { item }) => {
              return (
                <div style="display:flex;margin-right:20px;flex:1;align-items: center;">
                  <div style="font-size: 12px; color: #a7a7a7; flex: 1;text-align: left; padding-left: 18px;">
                    這裡使用jsx+render添加任意内容
                  </div>
                  <label style="width:60px">下拉框：</label>
                  <el-select
                    style="width:100px"
                    v-model={item.selectValue}
                    onChange={() => {
                      this.$message.success(item.selectValue)
                    }}
                  >
                    {item.selectOptions.map((c) => {
                      return <el-option key={c.key} label={c.value} value={c.key} />
                    })}
                  </el-select>

                  <label style="width:60px;margin-left:10px">掃描框：</label>
                  <el-input
                    style="width:100px"
                    v-model={item.inputValue} //绑定數據
                    placeholder="回車监听"
                    onChange={(v) => {
                      this.$message.success(item.inputValue)
                    }}
                  ></el-input>
                </div>
              )
            }
          },
          {
            name: '選擇數據', //按鈕名稱
            icon: 'el-icon-plus', //按鈕圖標，參照iview圖標
            hidden: false, //是否隐藏按鈕(如果想要隐藏按鈕，在onInited方法中遍歷buttons，設置hidden=true)
            onClick: () => {
              //觸發事件
              this.$refs.modelHeader.openDetail()
            }
          }
        ]
      )
      //手動調整明细表高度
      this.detailOptions.height = this.detailOptions.height + 40

      //配置編輯表單下拉框table搜索選項
      this.initFormSelectTable()

      //配置編輯彈出框明细表下拉框table搜索選項
      this.initDetailSelectTable()

      //設置二级表頭
      this.initSecondColumns()
    },

    initFormSelectTable(item) {
      //配置編輯表單下拉框table搜索選項
      this.editFormOptions.forEach((option) => {
        option.forEach((item) => {
          if (item.field == 'Customer') {
            item.disabled = false
            //配置請求的接口地址
            //可以使用生成的頁面接口，注意接口權限問題，如果提示没有權限,參照後台後開發文檔上的重寫權限示例
            //item.url = 'api/Demo_Customer/getPageData';

            //儘量自定義接口，見下面的文檔描述，或者Demo_CustomerController類的方法Search
            item.url = 'api/Demo_Customer/search'

            //設置顯示的字段
            item.columns = [
              {
                field: 'Customer_Id',
                title: 'Customer_Id',
                type: 'int',
                width: 110,
                hidden: true
              },
              //設置search:true,則字段可以搜索
              {
                field: 'Customer',
                title: '客户',
                type: 'string',
                width: 80,
                search: true
              }, //search是否開啟表格上方的字段搜索
              {
                field: 'PhoneNo',
                title: '手機',
                type: 'string',
                width: 110,
                search: true
              },
              {
                field: 'Province',
                title: '省',
                type: 'select',
                bind: { key: '省', data: [] },
                width: 80,
                search: true
              },
              {
                field: 'DetailAddress',
                title: '詳细地址',
                type: 'string',
                width: 120
              }
            ]

            //選中table數據後，回寫到表單
            item.onSelect = (rows) => {
              this.editFormFields.Customer = rows[0].Customer
              this.editFormFields.PhoneNo = rows[0].PhoneNo
            }

            /****下面的這些都是可以選配置，上面的是必填的******/

            //(輸入框搜索)表格數據加載前處理
            item.loadBefore = (param, callback) => {
              //方式1、手動設置查詢條件
              // param.wheres.push({
              //       name:"Customer",
              //       value:this.editFormFields.Customer,
              //       displayType:"like"
              // })
              //方式2、给param.value設置值，後台手動處理查詢條件
              param.value = this.editFormFields.Customer
              callback(true)
            }

            /****************下面這些配置不是必須的**************/
            //表格數據加載後處理
            item.loadAfter = (rows, callback, result) => {
              callback(true)
            }

            //設置彈出框高度(默認200)
            item.height = 200
            //設置彈出框寬度(默認500)
            //item.width = 400;
            // item.textInline = false; //設置表格超出自動換行顯示
            //設置表格是否單選
            item.single = true
            //設置是否顯示分頁
            item.paginationHide = false
          }
        })
      })
    },
    //配置編輯彈出框明细表下拉框table搜索選項
    initDetailSelectTable() {
      //配置編輯表單下拉框table搜索選項
      this.detailOptions.columns.forEach((item) => {
        if (item.field == 'GoodsName') {
          item.readonly = false
          //配置請求的接口地址
          //可以使用生成的頁面接口，注意接口權限問題，如果提示没有權限,參照後台後開發文檔上的重寫權限示例
          //item.url = 'api/Demo_Goods/getPageData';

          //儘量自定義接口，見下面的文檔描述，或者Demo_GoodsController類的方法Search
          item.url = 'api/Demo_Goods/search'

          //設置顯示的字段
          item.columns = [
            {
              field: 'GoodsName',
              title: '商品名稱',
              type: 'string',
              width: 120
            },
            {
              field: 'GoodsCode',
              title: '商品編號',
              type: 'string',
              width: 100
            },
            {
              field: 'Specs',
              title: '規格',
              type: 'string',
              width: 60,
              align: 'left'
            },
            { field: 'Price', title: '單價', type: 'decimal', width: 60 },
            { field: 'Remark', title: '備註', type: 'string', width: 100 }
          ]

          //選中table數據後，回寫到表單
          //editRow:當前正在編輯的行
          //rows:選中的行
          item.onSelect = (editRow, rows) => {
            editRow.GoodsName = rows[0].GoodsName
            editRow.GoodsCode = rows[0].GoodsCode
            editRow.Price = rows[0].Price
          }

          /****下面的這些都是可以選配置，上面的是必填的******/

          //(輸入框搜索)表格數據加載前處理
          //editRow:當前正在編輯的行
          //param:請求的參數
          item.loadBefore = (editRow, param, callback) => {
            //方式1、手動設置查詢條件
            // param.wheres.push({
            //       name:"GoodsName",
            //       value:row.GoodsName,
            //       displayType:"like"
            // })
            //方式2、给param.value設置值，後台手動處理查詢條件
            param.value = editRow.GoodsName
            callback(true)
          }

          /****************下面這些配置不是必須的**************/
          //表格數據加載後處理
          //editRow:當前正在編輯的行
          //rows:後台返回的數據
          item.loadAfter = (editRow, rows, callback, result) => {
            callback(true)
          }

          //設置彈出框高度(默認200)
          item.height = 200
          //設置彈出框寬度(默認500)
          item.selectWidth = 500
          item.textInline = true //設置表格超出自動換行顯示
          //設置表格是否單選
          item.single = true
          //設置是否顯示分頁
          item.paginationHide = true
        }
      })
    },
    initSecondColumns() {
      return
      //設置二级表頭
      this.columns.splice(0)
      //設置二级表頭
      this.columns.push(
        ...[
          {
            field: '基礎信息',
            title: '基礎信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'OrderNo',
                title: '訂單編號',
                type: 'string',
                link: true,
                width: 130,
                readonly: true,
                require: true,
                align: 'left',
                sort: true
              },
              {
                field: 'TotalPrice',
                title: '總價',
                type: 'decimal',
                width: 70,
                align: 'left'
              },
              {
                field: 'TotalQty',
                title: '總數量',
                type: 'int',
                width: 80,
                align: 'left'
              },
              {
                field: 'OrderDate',
                title: '訂單日期',
                type: 'date',
                width: 95,
                require: true,
                align: 'left',
                sort: true
              }
            ]
          },
          {
            field: '狀態',
            title: '狀態',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'OrderType',
                title: '訂單類型',
                type: 'int',
                bind: { key: '訂單狀態', data: [] },
                width: 90,
                require: true,
                align: 'left'
              },

              {
                field: 'OrderStatus',
                title: '訂單狀態',
                type: 'int',
                bind: { key: '訂單狀態', data: [] },
                width: 90,
                require: true,
                align: 'left'
              },
              {
                field: 'AuditStatus',
                title: '審核狀態',
                type: 'int',
                bind: { key: 'audit', data: [] },
                width: 80,
                align: 'left'
              }
            ]
          },
          {
            field: '創建人信息',
            title: '創建人信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'Id',
                title: '主鍵ID',
                type: 'string',
                width: 90,
                hidden: true
              },
              {
                field: 'CreateDate',
                title: '創建時間',
                type: 'datetime',
                width: 120,
                sortable: true
              },
              {
                field: 'Creator',
                title: '創建人',
                type: 'string',
                width: 80,
                align: 'left'
              }
            ]
          },
          {
            field: '修改人信息',
            title: '修改人信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'Modifier',
                title: '修 改 人',
                type: 'string',
                width: 80,
                align: 'left'
              },
              {
                field: 'ModifyDate',
                title: '修改時間',
                type: 'datetime',
                width: 150,
                sortable: true
              }
            ]
          }
        ]
      )
    },

    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
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

    modelOpenAfter(row) {
      //點擊編輯、新建按鈕彈出框後，可以在此處寫邏輯，如，從後台獲取數據
      //(1)判斷是編輯還是新建操作： this.currentAction=='Add';
      //(2)给彈出框設置默認值
      //(3)this.editFormFields.字段='xxx';
      //如果需要给下拉框設置默認值，請遍歷this.editFormOptions找到字段配置對應data屬性的key值
      //看不懂就把輸出看：console.log(this.editFormOptions)
    }
  }
}
export default extension
