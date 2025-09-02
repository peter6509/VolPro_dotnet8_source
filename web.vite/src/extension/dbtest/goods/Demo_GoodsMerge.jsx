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
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    //下面這些方法可以保留也可以删除
    onInit() {

      this.text='<span style="color: #0f84ff;">生成頁面簡單配置完成字段合並</span>';
      this.queryFields=['GoodsName','CatalogId']


      //設置table表格文字超出後換行顯示
      this.textInline = false

      //設置是否可用字段為switch編輯狀態
      let column = this.columns.find((x) => {
        return x.field == 'Enable'
      })
      column.edit = {
        type: 'switch',
        keep: true
      }
      //是否可用字段設置切換事件並保存到數據庫
      column.onChange = (value, row, tableData) => {
        let url = `api/Demo_Goods/updateStatus?goodsId=${row.GoodsId}&enable=${row.Enable}`
        this.http.get(url, {}, true).then((result) => {
          // this.$Message.success(result);
        })
      }

      this.columns.forEach((x) => {
        if (['CatalogId', 'GoodsCode', 'Img'].includes(x.field)) {
          x.hidden = true
        } else if (x.field == 'GoodsName') {
          x.width = 240;
          x.align="center";
          x.render = (h, { row, column, index }) => {
            //手動轉換分類的字典編號
            let item = this.columns
              .find((c) => {
                return c.field == 'CatalogId'
              })
              .bind.data.find((c) => {
                return c.key == row.CatalogId
              })
              //獲取轉換的字典
            let catalog = row.CatalogId
            if (item) {
              catalog = item.value
            }

            return (
              <div style="display:flex;padding:5px;cursor: pointer;text-align: left;">
                <img
                 onClick={()=>{this.viewImg(row)}}
                  style="height: 80px;width:70px;border-radius: 5px;object-fit: cover;"
                  src={this.http.ipAddress + row.Img}
                />
                <div style="line-height: 1.2;margin:0 10px;font-size: 13px;" onClick={()=>{this.edit(row)}}>
                  <div style="color: #0f84ff;margin-bottom:5px;">{row.GoodsName}</div>
                  <div style="margin-bottom:5px;">
                    分類：<el-tag type="success">{catalog}</el-tag>{' '}
                    <span style="margin-left:10px;margin-right:5px;font-size:12px;">¥</span>
                    <span style="font-weight:bolder;color:red;font-size:15px;">{row.Price}</span>
                  </div>
                  <div>編碼：{row.GoodsCode}</div>
                </div>
              </div>
            )
          }
        }
      })
    },
    viewImg(row){//預覽圖片
          this.$refs.table.viewImg(row,{field:"Img"});
    },
    searchBefore(param) {
      return true
    },
    modelOpenAfter(row) {}
  }
}
export default extension
