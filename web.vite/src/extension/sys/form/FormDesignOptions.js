//author:jxx
//此處是對表單的方法，组件，權限操作按鈕等進行任意擴展(方法擴展可參照SellOrder.js)
import  gridHeader from './FormCollectionOptionsGridHeader.vue'
import { h, resolveComponent } from 'vue';
let extension = {
    components: {//動態擴充组件或组件路徑
        //表單header、content、footer對應位置擴充的组件
        gridHeader:gridHeader,//{ template: "<div>擴展组xx件</div>" },
        gridBody: {
            render() {
              return [
                h(resolveComponent('el-alert'), {
                  style: { 'margin-bottom': '12px' },
                  'show-icon': true, type: 'success',
                  closable: false, title: '1、點擊新建隨便輸入,2、點擊表格[表單設計]然後保存,3、點擊預覽(頁面打開後提交數據),4、數據采集頁面看查结果'
                }, ''),
              ]
            }
          },
        gridFooter: '',
        //彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
        modelHeader: '',
        modelBody: '',
        modelFooter: ''
    },
    buttons: {view: [], box:[],  detail:[]},//擴展的按鈕
    methods: {//事件擴展
        onInit() {
            this.boxOptions.height=200;
            this.initFormButton();
        },
        onInited(){
            this.height=  this.height-40;
        },
        initFormButton() {
            this.columns.splice(this.columns.findIndex(x => { return x.field == 'FormFields' }), 1, ...[{
                title: "操作",
                field: "表單設計",
                with: 80,
                sort: false,
                formatter: () => {
                    return '<a style="color: #3a8ee6;">表單設計</a>'
                },
                click: (row) => {
                    this.$refs.gridHeader.open(row);
                }
            }, 
             {
                title: "預覽",
                field: "預覽",
                with: 85,
                sort: false,
                formatter: () => {
                    return '<a style="color: #3a8ee6;">預覽</a>'
                },
                click: (row) => {
                    this.$tabs.open({
                        path: "/formSubmit", text: row.Title, query: {
                            id: row.FormId
                        }
                    })
                    //  this.$refs.gridHeader.open(row);
                }
            }])
        }
    }
};
export default extension;