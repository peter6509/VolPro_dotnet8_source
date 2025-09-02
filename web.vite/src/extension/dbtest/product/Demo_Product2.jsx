//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import { h, resolveComponent } from 'vue';

import gridHeader from './Demo_Product2/Demo_ProductGridHeader.vue';
import gridFooter from './Demo_Product2/Demo_ProductGridFooter.vue';
import modelBody from './Demo_Product2/Demo_ProductModelBody.vue';

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
              type: 'info',
              closable: false,
              title:
                '一對多與上面[產品管理]區别：可通過屬性配置明细表顯示為左右结構,點擊編輯或者新建可以查看效果(文檔：前端開發文檔->編輯彈出框三级明细左右结構顯示)'
            },
            ''
          )
        ];
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
  text: '一對多更快、更高效。。。',
  methods: {
    initAuditColumn(){
      
    },
    onInited() {
      this.dragPosition = 'bottom'; //設置拖動改變表格高度
      //設置明细表顯示順序
      this.multiple.horizontal = true; //一對多水平顯示(二级表與三级表是否左右结構顯示)
      this.multiple.leftWidth = 600; //左邊二级表寬度(默認不用設置)
      //this.multiple.rightWidth = this.boxOptions.width - 600; //左邊三级表寬度(默認不用設置)

      this.height = this.height / 2 - 50; // 300;

      //設置主表合計
      // this.summary = true;
      //如果有明细表,設置明细表合計
      // this.detailOptions.summary = true;

      //設置主表求字段，後台需要實現SummaryExpress方法
      // this.columns.forEach((x) => {
      //   if (x.field == 'Price') {
      //     x.summary = true;
      //     //計算平均值
      //     //x.summary = 'avg';//2023.05.03更新voltable文件後才能使用
      //     //設置小數顯示位數(默認2位)
      //     // x.numberLength = 4;
      //   }
      // });

      if (this.$route.path == '/Demo_Product2') {
        this.details.forEach((x) => {
          x.columns.forEach((item) => {
            if (
              ['CreateDate', 'Creator', 'Modifier', 'ModifyDate'].indexOf(
                item.field
              ) != -1
            ) {
              item.hidden = true;
            }
          });
        });

        this.subDetails.forEach((x) => {
          x.columns.forEach((item) => {
            if (
              ['CreateDate', 'Creator', 'Modifier', 'ModifyDate'].indexOf(
                item.field
              ) != -1
            ) {
              item.hidden = true;
            }
          });
        });
      }
    },
    //明细表點擊行事件
    // detailRowClick({ row, column, event, item }) {
    //   this.getTable(item.table).$refs.table.toggleRowSelection(row);
    // },
    onInit() {
      this.showCustom = false;

      this.columns.forEach((x) => {
        if (x.field == 'ProductCode') {
          x.render = (h, { row, column, index }) => {
            return (
              <el-popover
                placement="right"
                title="提示信息"
                width={250}
                trigger="hover"
              >
                {{
                  reference: (
                    <div>
                      <div>{row.ProductCode}</div>
                    </div>
                  ),
                  default: () => {
                    return (
                      <div style="line-height:1.5;">
                        <div>商品編號：{row.ProductCode}</div>
                        <div>商品價格：{row.Price}</div>
                        <div>創建時間：{row.CreateDate}</div>
                      </div>
                    );
                  }
                }}
              </el-popover>
            );
          };
        }
      });
    },
    searchDetailBefore(param, table, item) {
      //明细表查詢前方法

      return true;
    },
    searchDetailAfter(data, table, item) {
      //明细表查詢後方法
      return true;
    },
    modelOpenAfter() {},

    searchAfter(result) {
      //查詢後，清空原來記錄選中行的id
      // this.$store.getters.data().ProductId = null;
      return true;
    },
    //操作步驟1：主表點擊事件加載明细數據
    rowClick({ row, column, event }) {
      //點擊主表table行數據，加載主界面下面的兩個table數據
      //vuex
      //缓存當前選中行的主鍵id
      this.$store.getters.data().ProductId = row.ProductId;

      //清除原來選中的行
      this.$refs.table.$refs.table.clearSelection();

      //查詢界面點擊行事件
      this.$refs.table.$refs.table.toggleRowSelection(row, true); //單擊行時選中當前行;

      //調用下面選項卡的查詢
      //見Demo_ProductGridFooter.vue文件rowClick方法
      this.$refs.gridFooter.rowClick(row);
    }
  }
};
export default extension;
