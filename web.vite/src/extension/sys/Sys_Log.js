import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    //動態擴充组件或组件路徑
    //表單header、content、footer對應位置擴充的组件
    gridHeader: "", //{ template: "<div>擴展组xx件</div>" },
    gridBody: '',
    gridFooter: "",
    //彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
    modelHeader: "",
    modelBody: "",
    modelFooter: ""
  },
  buttons: [], //擴展的按鈕
  methods: {
    //事件擴展
    onInit() {
      // console.log("sys_log")
     //this.setFiexdSearchForm(true);
    },
    onInited() {
     // this.height = this.height - 195;
    }
  }
};
export default extension;
