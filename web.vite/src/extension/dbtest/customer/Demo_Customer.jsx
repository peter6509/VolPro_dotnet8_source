/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文檔見：http://v2.volcore.xyz/document/api 【代碼生成頁面ViewGrid】
 **常用示例見：http://v2.volcore.xyz/document/vueDev
 **後台操作見：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用來自定義擴展業務代碼，可以擴展一些自定義頁面或者重新配置生成的代碼

let provinceOption, //省
  cityOption, //市
  countyOption; //縣

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
  tableAction: 'Demo_Customer', //指定某張表的權限(這裡填寫表名,默認不用填寫)
  buttons: { view: [], box: [], detail: [] }, //擴展的按鈕
  methods: {
    onInit() {
      this.editFormOptions.forEach((options) => {
        options.forEach((item) => {
          //省的配置參數
          if (item.field == 'Province') {
            provinceOption = item;
          }
          //市的配置參數
          if (item.field == 'City') {
            cityOption = item;
          }
          //縣的配置參數
          if (item.field == 'County') {
            countyOption = item;
          }
        });
      });
      //省選擇事件
      provinceOption.onChange = (value, option) => {
        let url = 'api/Sys_Region/getList?code=' + value;
        //给市重新绑定數據源
        this.http.get(url, {}, true).then((result) => {
          cityOption.data = result;
        });
      };
      //市選擇事件
      cityOption.onChange = (value, option) => {
        let url = 'api/Sys_Region/getList?code=' + value;
        //给縣重新绑定數據源
        this.http.get(url, {}, true).then((result) => {
          countyOption.data = result;
        });
      };
    },
    onInited() {
      //選項卡頁面减去tabs高度
      if (this.$route.path == '/tabs') {
        this.height = this.height-110;
      }


      //在訂單管理的選擇數據彈出框顯示此頁面時，重新調整頁面高度與隐藏其他的按鈕
      if (this.$route.path == '/Demo_Order') {
        this.height = 550 - 150;
        //訂單頁面隐藏按鈕
        this.buttons.forEach((item) => {
          if (item.value != 'Search') {
            item.hidden = true;
          }
        });
      }

      //設置表單分组,通過splice在指定的行位置添加信息
      this.editFormOptions.splice(0, 0, [
        {
          colSize: 12,
          render: (h) => {
            return (
              <div
                style="display: flex;margin-bottom: -4px;line-height: 20px; padding-bottom: 2px;border-bottom: 1px solid #e4e4e4;margin-left: 10px">
                <div style="height: 14px; background: #1794f8; width: 4px; border-radius: 10px;margin-top: 2px;"></div>
                <div style="padding-left: 6px; font-weight: bold; font-size: 13px;">
                  基本信息
                </div>
              </div>
            );
          }
        }
      ]);

      //設置表單分组,通過splice在第2行位置添加信息
      this.editFormOptions.splice(2, 0, [
        {
          colSize: 12,
          render: (h) => {
            return (
              <div
                style="display: flex;margin-bottom: -4px;line-height: 20px; padding-bottom: 2px;border-bottom: 1px solid #e4e4e4;margin-left: 10px"
              >
                <div style="height: 14px; background: #1794f8; width: 4px; border-radius: 10px;margin-top: 2px;"></div>
                <div style="padding-left: 6px; font-weight: bold; font-size: 13px;">
                  地址信息
                </div>
              </div>
            );
          }
        }
      ]);
      //設置二级表頭
      this.initSecondColumns();
    },
    initSecondColumns() {

      //設置二级表頭
      this.columns.splice(0);
      //設置二级表頭
      this.columns.push(
        ...[
          {
            field: '基礎信息',
            title: '基礎信息',
            type: 'string',
            align: 'center',
            children: [{ field: 'Customer_Id', title: 'Customer_Id', type: 'int', width: 110, hidden: true, readonly: true, require: true, align: 'left' },
            { field: 'Customer', title: '客户', type: 'string', link: true, width: 100, require: true, align: 'left', sort: true },
            { field: 'PhoneNo', title: '手機', type: 'string', width: 130, require: true, align: 'left' },
            ]
          },
          {
            field: '地址信息',
            title: '地址信息',
            type: 'string',
            align: 'center',
            children: [
              { field: 'Province', title: '省', type: 'string', bind: { key: '省', data: [] }, width: 80, require: true, align: 'left' },
              { field: 'City', title: '市', type: 'string', bind: { key: '市', data: [] }, width: 80, require: true, align: 'left' },
              { field: 'County', title: '縣', type: 'string', bind: { key: '縣', data: [] }, width: 120, align: 'left' },
              { field: 'DetailAddress', title: '詳细地址', type: 'string', width: 120, align: 'left' },
            ]
          },
          {
            field: '其它信息',
            title: '其它信息',
            type: 'string',
            align: 'center',
            children: [
              { field: 'Remark', title: '備註', type: 'string', width: 100, align: 'left' },
              { field: 'CreateID', title: 'CreateID', type: 'int', width: 80, hidden: true, align: 'left' },
              { field: 'Creator', title: '創建人', type: 'string', width: 100, align: 'left' },
              { field: 'CreateDate', title: '創建時間', type: 'datetime', width: 145, align: 'left', sort: true },
              { field: 'ModifyID', title: 'ModifyID', type: 'int', width: 80, hidden: true, align: 'left' },
              { field: 'Modifier', title: '修改人', type: 'string', width: 100, hidden: true, align: 'left' },
              { field: 'ModifyDate', title: '修改時間', type: 'datetime', width: 145, hidden: true, align: 'left', sort: true }]
          }])
    },
    searchBefore(params) {
      //訂單管理頁面打開彈出框設置查詢條件
      if (this.$route.path == '/Demo_Order') {
        params.wheres.push({
          name: '查詢的字段',
          //訂單管理查詢打開時全局缓存的值,見Demo_Order.js第78行與orderModelHeader.vue第133行(2022.12.06)
          value: this.$store.getters.data().orderId
        });
      }
      return true;
    },
    modelOpenAfter(row) {
      //點擊編輯/新建按鈕打開彈出框

      //新建操作市與縣的數據源清空
      if (this.currentAction == 'Add') {
        cityOption.data = []; //市
        countyOption.data = []; //縣
      } else {
        //編輯操作重新绑定當省對應下的市、縣的數據
        let url = 'api/Sys_Region/getList?code=' + this.editFormFields.Province; //row.Province;
        //给市重新绑定數據源
        this.http.get(url, {}, true).then((result) => {
          cityOption.data = result;
        });

        //给縣重新绑定數據源
        url = 'api/Sys_Region/getList?code=' + this.editFormFields.City; //row.City;
        this.http.get(url, {}, true).then((result) => {
          countyOption.data = result;
        });
      }
    }
  }
};
export default extension;
