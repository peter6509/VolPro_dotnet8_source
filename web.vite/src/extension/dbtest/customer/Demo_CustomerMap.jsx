import modelRight from './Demo_CustomerMapModelRight.vue';
import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    //查詢界面擴展组件
    gridHeader: '',
    gridBody: {
      render() {
        return h(
          <el-alert
            show-icon={true}
            closable={false}
            style="margin-bottom:10px"
            type="success"
            title="點擊新建或編輯進行地圖選點(只需簡單配置即可實現編輯表單左右结構)"
          ></el-alert>
        );
      }
    },
    gridFooter: '',
    //新建、編輯彈出框擴展组件
    modelHeader: '',
    modelBody: '',
    modelRight: modelRight,
    modelFooter: ''
  },
  text: '',
  tableAction: '', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    onInit() {

      //設置彈出框高度
      this.boxOptions.width = 900;
      //設置表單標籤顯示位置，顯示到左邊(也可以在main.js统一設置labelPosition屬性)
      this.labelPosition = 'left';
      //設置表單標籤寬度
      this.boxOptions.labelWidth = 70;
    },
    onInited() {
      //調整表單高度
      this.height = this.height - 40;
    },
    modelOpenAfter(row) {}
  }
};
export default extension;
