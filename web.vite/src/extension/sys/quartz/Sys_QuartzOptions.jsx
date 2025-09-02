/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼
import gridBody from './Sys_QuartzOptionsGridBody';
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: '',
    gridBody: gridBody,
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
      this.textInline = false;
      this.columns.push({
        field: '操作',
        title: '操作',
        width: 180,
        fixed: 'right',
        align: 'center',
        render: (h, { row, column, index }) => {
          return (
            <div>
              <el-buton
                type="primary"
                style="color:#2882df;font-size:12px;"
                onClick={() => {
                  this.edit(row);
                }}
                type="text"
              >
                編輯
              </el-buton>
              <el-buton
                type="primary"
                style="color:#2882df;font-size:12px;margin-left:10px;"
                onClick={() => {
                  this.request('Run', row, 'once');
                }}
                type="text"
              >
                執行一次
              </el-buton>
              <el-buton
                type="primary"
                style="color:#2882df;font-size:12px;margin-left:10px;"
                onClick={() => {
                  if (row.Status == 1) {
                    //開啟任務
                    this.request('start', row);
                  } else {
                    this.request('pause', row);
                  }
                }}
                type="text"
              >
                {row.Status == 1 ? '恢復' : '暫停'}
              </el-buton>
              <el-buton
                type="primary"
                style="color:#2882df;font-size:12px;margin-left:10px;"
                onClick={() => {
                  this.$store.getters.data().quartzId = row.Id;
                  this.$refs.gridBody.open();
                }}
                type="text"
              >
                日誌
              </el-buton>
            </div>
          );
        }
      });
      //示例：設置修改新建、編輯彈出框字段標籤的長度
      // this.boxOptions.labelWidth = 150;
    },
    request(action, row,val) {
      let url = `api/Sys_QuartzOptions/${action}?val=${val}`;
      this.http.post(url, row, true).then((result) => {
        this.$message.success('執行成功');
        this.search();
      });
    },
    onInited() {
      this.height = this.height - 50;
      this.columns.forEach((col) => {
        if (col.field == 'Status') {
          col.align = 'center';
          col.formatter = (row) => {
            //  return row.Status;
            if (row.Status == 1) {
              return '<a style="color:red;"><span style="display: inline-block;padding: 4px;background: red; border-radius: 50%; margin-right: 5px;"></span>暫停</a>';
            }
            return '<a style="color:#04b348;"><span style="display: inline-block;padding: 4px;background: #20c423; border-radius: 50%; margin-right: 5px;"></span>正常</a>';
          };
        }
      });
      //框架初始化配置後
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
      this.editFormOptions.forEach((options) => {
        options.forEach((option) => {
          if (option.field == 'CronExpression') {
            option.extra = {
              style: 'color: #0e84ff;cursor: pointer;',
              text: '查看',
              click: () => {
                window.open('https://cron.qqe2.com/', '_blank');
              }
            };
          }else if(option.field=='PostData'){
              option.placeholder=`post參數格式如：{name:"1",value:"2"}`;
          }
        });
      });
    },
    searchBefore(param) {
      //界面查詢前,可以给param.wheres添加查詢參數
      //返回false，則不會執行查詢
      return true;
    },
    searchAfter(result) {
      //查詢後，result返回的查詢數據,可以在顯示到表格前處理表格的值
      return true;
    },
    addBefore(formData) {
      //新建保存前formData為對象，包括明细表，可以给给表單設置值，自己輸出看formData的值
      return true;
    },
    updateBefore(formData) {
      //編輯保存前formData為對象，包括明细表、删除行的Id
      return true;
    },
    rowClick({ row, column, event }) {
      //查詢界面點擊行事件
      // this.$refs.table.$refs.table.toggleRowSelection(row); //單擊行時選中當前行;
    },
    modelOpenAfter(row) {
      if (this.currentAction == 'Add' || !this.editFormFields.TimeOut) {
        this.editFormFields.TimeOut = 180;
      }
      this.editFormOptions.forEach((options) => {
        options.forEach((option) => {
          if (option.field == 'GroupName') {
            option.readonly = this.currentAction != 'Add';
          }
        });
      });
    }
  }
};
export default extension;
