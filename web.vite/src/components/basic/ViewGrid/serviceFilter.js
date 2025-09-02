

let serviceFilter = {
  onInit() { //對應created
    console.log('Create執行前')
  },
  onInited() { //對應created，在onInit與onInited中間會初始化界面數據對象
    console.log('Create執行後')
  },
  mounted() {
    console.log('mounted');
  },
  searchBefore(param) { //查詢ViewGird表數據前,param查詢參數
    // console.log('表' + this.table.cnName + '觸發loadTableBefore');
    return true;
  },
  //2020.10.30增加查詢後返回所有的查詢信息
  searchAfter(param, result) { //查詢ViewGird表數據後param查詢參數,result回返查詢的结果
    // console.log('表' + this.table.cnName + '觸發loadTableAfter');
    return true;
  },
  searchDetailBefore(param, callBack, table, item) {//查詢從表表數據前,param查詢參數
    //console.log(this.detailOptions.cnName + '觸發loadDetailTableBefore');
    return true;
  },
  searchDetailAfter(param, data) {//查詢從表後param查詢參數,result回返查詢的结果
    // console.log(this.detailOptions.cnName + '觸發loadDetailTableAfter');
    return true;
  },
  delBefore(ids, rows) { //查詢界面的表删除前 ids為删除的id數组,,rows删除的行
    return true;
  },
  delAfter(result) {//查詢界面的表删除後
    return true;
  },
  delDetailRow(rows) { //彈出框删除明细表的行數據(只是對table操作，並没有操作後台)
    return true;
  },
  addBefore(formData) { //新建保存前formData為對象，包括明细表
    return true;
  },
  async addBeforeAsync(formData) { //異步處理,功能同上(2020.12.06)
    return true;
  },
  addAfter(result) {//新建保存後result返回的狀態及表單對象
    return true;
  },
  updateBefore(formData) { //編輯保存前formData為對象，包括明细表、删除行的Id
    return true;
  },
  async updateBeforeAsync(formData) { //異步處理,功能同上(2020.12.06)
    return true;
  },
  updateAfter(result) {//編輯保存後result返回的狀態及表單對象
    return true;
  },
  auditBefore(ids, rows) {//審核前
    return true;
  },
  auditAfter(result, rows) {// 審核後
    return true;
  },
  resetAddFormBefore() { //重置新建表單前的内容
    return true;
  },
  resetAddFormAfter() { //重置新建表單後的内容
    return true;
  },
  resetUpdateFormBefore() { //重置編輯表單前的内容
    return true;
  },
  resetUpdateFormAfter() { //重置編輯表單後的内容
    return true;
  },
  modelOpenBefore(row) { //點擊編輯/新建按鈕彈出框前，可以在此處寫邏輯，如，從後台獲取數據

  },
  modelOpenAfter(row) {  //點擊編輯/新建按鈕彈出框後，可以在此處寫邏輯，如，從後台獲取數據

  },
  importAfter(data) { //導入excel後刷新table表格數據
    this.search();
  },
  //2020.10.31添加導入前的方法
  importExcelBefore(formData) { //導入excel導入前
    return this.importBefore(formData);
  },
  importBefore(formData) { //導入excel導入前
    //往formData寫一些其他參數提交到後台，
    // formData.append("val2", "xxx");
    //後台按下面方法獲取請求的參數
    // Core.Utilities.HttpContext.Current.Request("val2");
    console.log(this.$refs.table.getSelected())
    return true;
  },
  reloadDicSource() { //重新加載字典绑定的數據源
    this.initDicKeys();
  },
  exportBefore(param) { //2020.06.25增加導出前處理
    return true;
  },
  onModelClose(iconClick) {
    //iconClick=true為點擊左中上角X觸發的關閉事件
    //如果返回 false不會關閉彈出框 
    //return false;
    this.boxModel = false;
  },
  selectable(row, index) {
    //表CheckBox 是否可以勾選
    return true;
  },
  onSortEnd(newIndex, oldIndex, rows) {
    this.sortEnd(newIndex, oldIndex, rows)
  },
  sortEnd(newIndex, oldIndex, rows) {
  },
  detailOnSortEnd( rows, newIndex, oldIndex,table) {
    this.detailSortEnd( rows, newIndex, oldIndex, table);
  },
  detailSortEnd( rows, newIndex, oldIndex) {
  }
}
export default serviceFilter;
