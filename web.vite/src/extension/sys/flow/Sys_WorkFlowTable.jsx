import gridBody from '@/components/basic/ViewGrid/ViewGridAudit.vue';
import girdHeader from './Sys_WorkFlowTableGirdHeader'
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader:girdHeader,

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
    initAuditColumn(){
      
    },
    //下面這些方法可以保留也可以删除
    onInit() {
      //表格上添加自定義按鈕
      this.columns.push({
        title: '操作',
        field: '操作',
        width: 120,
        align: 'center',
        render: (h, { row, column, index }) => {
          return (
            <div>
              <el-button
                onClick={($e) => {
                  this.$refs.gridBody.open([row], true);
                }}
                type="primary"
                plain
                size="small"
                style="height:26px; padding: 10px !important;"
              >
                審核
              </el-button>
              <el-button
                onClick={($e) => {
                  this.$tabs.open({
                    text: row.WorkTableName || row.WorkName,
                    path: '/' + row.WorkTable,
                    query: { id: row.WorkTableKey, viewflow: 1 }
                  });
                }}
                type="default"
                plain
                size="small"
                style="height:26px; padding: 10px !important;"
              >
                查看
              </el-button>
            </div>
          );
        }
      });
    },
    onInited() {
      this.searchFormOptions.length=0;
      this.singleSearch = null;
      this.showCustom=false;
      this.buttons.find(x=>{return x.name=='高级查詢'}).hidden=true;
      //框架初始化配置後
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
      this.height=this.height-35;

      this.AuditStatus=0;
    },
    searchBefore(param) {
      // param.wheres.push({
      //   name:"AuditStatus",
      //   value:this.AuditStatus,
      //   displayType:"selectList"
      // })
      param.value=this.AuditStatus;
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
      //點擊編輯、新建按鈕彈出框後，可以在此處寫邏輯，如，從後台獲取數據
      //(1)判斷是編輯還是新建操作： this.currentAction=='Add';
      //(2)给彈出框設置默認值
      //(3)this.editFormFields.字段='xxx';
      //如果需要给下拉框設置默認值，請遍歷this.editFormOptions找到字段配置對應data屬性的key值
      //看不懂就把輸出看：console.log(this.editFormOptions)
    }
  }
};
export default extension;
