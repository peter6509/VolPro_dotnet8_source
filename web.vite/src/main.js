import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css'
import './assets/element-icon/icon.css'
import './assets/bootstrap-icons/font/bootstrap-icons.min.css'
import base from './uitils/common'
import http from './api/http'
// import 'dayjs/locale/zh-cn'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import translator from './uitils/translator'
import permission from './api/permission'
import viewgird from './components/basic/ViewGrid'
import ServiceSelect from './components/ServiceSelect'
import VolEdit from './components/basic/VolEdit.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import VolSelectBox from './components/basic/VolSelectBox'
import VolSelectTable from './components/basic/VolSelectTable'
translator.init(app)
app.config.globalProperties.base = base
app.config.globalProperties.http = http
app.config.globalProperties.$tabs = {}
app.config.globalProperties.permission = permission

//自定義全局配置生成頁面
app.config.globalProperties.$grid = {
  // test1() {
  // },
  // test2(){
  // },
}

app.config.globalProperties.$global = {
  dataVersion: "",//版本號字段(數據表字段必須是varchar類型，長度50)，解决多人編輯同一條數據時被替換的問題(2024.06.10)
  layout: 'left', //菜單布局方式：classics=經典導航，top=頂部導航,left=側邊導航
  theme: 'dark', //默認布局顏色：dark、blue、red、orange、green
  menuSearch: true, //菜單是否啟用搜索功能
  navSearch: true, //導航是否啟用菜單搜索功能2024.06.26
  table: {
    smallCell: true, //表格單元格大小
    useTag: true, //table组件下拉框數據源的字段是否顯示背景顏色
    showAudit: true, //表格是否顯示【查看流程】
    boxAudit: false,//編輯彈出框中顯示審批按鈕2024.07.03(與上面的showAudit同時開啟才會生效)
    cascaderFullPath:true//级聯數據源是否顯示完整路徑
  },
  border: true,
  lang: true, //是否使用多語言
  labelPosition: 'top', //表單(彈出框表單)標籤顯示位置,可選值，top、left，2023.07.04
  db: true, //是否使用分庫
  signalR: true, //是否開啟signalR
  fixedSearch: false,//2024.07.21增加全局固定查詢條件
  gridPadding: false,//2024.07.21增加生成頁面padding間距
  fullscreen:true,//彈出框顯示最大化按鈕
  audit: {
    //審核選項
    data: [
      { text: '通過', value: 1 },
      { text: '拒绝', value: 3 },
      { text: '駁回', value: 4 }
    ],
    auditType:[  //自定義審批類型，注意:key必須>=10,並且不能重複
      // { key: 10, value: '提交人部門主管' },
      // { key: 20, value: '提交人直屬上级' }
    ],
    status: [0, 2] //審核中的數據
    // 待審核 = 0,
    // 審核通過 = 1,
    // 審核中 = 2,
    // 審核未通過 = 3,
    // 駁回 = 4
  }
}

import DeptSelect from './components/DeptSelect'
//工作台管理(2024.06.10)
import VueGridLayout from 'vue-grid-layout'
import './components/VolDashboard/style.css'
import dashboard from './components/VolDashboard/vol-dashboard.js'
app
  .use(store)
  .use(ElementPlus, { size: 'default' })
  .use(router)
  .use(DeptSelect)
  .use(ServiceSelect)
  .use(VolEdit)
  .use(viewgird)
  .use(VolSelectBox)
  //工作台管理(2024.06.10)
  .use(VolSelectTable)
  .use(VueGridLayout)
  .use(dashboard)
  .mount('#app')
app.config.globalProperties.$Message = app.config.globalProperties.$message
