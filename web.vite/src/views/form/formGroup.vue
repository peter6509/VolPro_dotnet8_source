<template>
  <div class="container">
    <div class="header">
      <el-alert type="error" title="表單分组" :closable="false">
        表單分组支持自定義Tabs選項卡分组配置，解决字段過多時顯示的問題。配置與前面的【表單组件】配置相同，只需要增加group屬性
      </el-alert>
    </div>
    <div class="content">
      <VolForm ref="form" :loadKey="true" :formFields="formFields" :formRules="formRules">
        <div style="text-align: center; margin-top: 20px; width: 100%">
          <el-button type="primary" plain @click="getForm">獲取表單</el-button>
          <el-button type="success" plain @click="reset">重置表單</el-button>
          <el-button type="success" plain @click="resetData">刷新數據源</el-button>
        </div>
      </VolForm>
    </div>
  </div>
</template>
<script lang="jsx">
import VolForm from "@/components/basic/VolForm.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
export default {
  props: {
    showBtn: { type: Boolean, default: true },
  },
  components: {
    VolForm,
    VolHeader,
  },
  methods: {
    setReadonlyStaus(status) {
      this.formRules.forEach((rules) => {
        rules.forEach((option) => {
          option.readonly = status;
        });
      });
    },
    getForm() {
      this.$refs.form.validate(() => {
        this.$message.error(JSON.stringify(this.formFields));
      });
    },
    reset() {
      //重置表單，重置時可指定重置的值，如果没有指定重置的值，默認全部清空
      let data = { decimalVal: 100, numberVal: 100 };
      this.$refs.form.reset(data);
      this.$message.error("表單已重置");
    },
    popover() {
      this.$message.success("點擊了提示");
    },
    resetData(){
      this.$refs.form.initSource(true);
      this.$message.success("刷新成功");
    }
  },
  data() {
    return {
      formFields: {
        uploadFile: [
          {
            name: "exceltest.xlsx",
            path:
              "https://imgs-1256993465.cos.ap-chengdu.myqcloud.com/github/exceltest.xlsx",
          },
        ],
        img: [
          {
            name: "060222.jpg",
            path:
              "http://api.volcore.xyz/Upload/Tables/App_Expert/202103061753415708/060222.jpg",
          },
        ],

        inputVal: null,
        decimalVal: 100,
        numberVal: 100,
        selectVal: null,
        phoneValue: null,
        mailVal: null,
        extraVal: null,

        customVal: null,
        dateTimeVal: null,
        dateVal: null,
        dateRangeVal: [null, null], //日期範圍是數组
        monthVal: null,

        cascaderVal: [], //级聯的默認值是數组
        treeVal: null,

        selectVal: null,
        selectAutoVal: null,
        selectListVal: [], //多選值

        selectTableVal: "",
        selectNameVal: "",
        selectCodeVal: "",
        selectTextVal: "純文本顯示",

        radioVal: "1", //設置單選框默認值
        checkBoxVal: [], //多選框是數组
        editorValue: "",
      },
      formRules: [
        //表單配置formRules數據格式是二维數组，表示每個標籤所在位置:[[{},{}]]
        [
          {
            type: "text",
            title: "輸入框",
            required: true,
            placeholder: "輸入框。。。",
            field: "inputVal",
            group: "輸入類型",
          },
          {
            type: "decimal",
            title: "小數",
            //required: true,
            placeholder: "只能輸入小數",
            field: "decimalVal",
            group: "輸入類型",
          },
          {
            type: "number",
            title: "整數",
            placeholder: "只能輸入整數",
            field: "numberVal",
            min: 0, //限制數字大小
            max: 10,
            group: "輸入類型",
          },
          {
            title: "額外標籤",
            field: "extraVal",
            type: "text",
            extra: {
              style: "color:#2196F3;cursor: pointer;font-size:12px",
              icon: "el-icon-search", //顯示圖標
              //text: "點擊", //顯示文本
              //觸發事件
              click: (item) => {
                this.$message.error("點擊標籤觸發的事件");
              },
            },
            group: "輸入類型",
          },
          {
            title: "手機",
            // required: true,
            field: "phoneValue",
            type: "phone",
            group: "輸入類型",
          },
        ],
        [
          {
            title: "郵箱",
            //required: true,
            field: "mailVal",
            type: "mail",
            group: "輸入類型",
          },
          {
            title: "自定義驗證",
            // required: true,
            field: "customVal",
            placeholder: "只能輸入值：123",
            type: "text",
            validator: (rule, val) => {
              if (!val && val != "0") {
                return "";
              }
              if (val != "123") {
                return "自定設置必須輸入123";
              }
              return "";
            },
            group: "輸入類型",
          },
          {
            title: "日期(datetime)",
            // required: true,
            placeholder: "限制時間範圍",
            field: "dateTimeVal",
            type: "datetime", //
            min: "2021-07-01", //設置日期選擇範圍
            max: Date.now(), // //設置日期選擇範圍
            onChange: (val) => {
              console.log("選擇日期:" + val);
            },
            group: "輸入類型",
          },
          {
            title: "日期(date)",
            // required: true,
            placeholder: "限制時間範圍",
            field: "dateVal",
            type: "datetime",
            min: "2021-07-01", //設置日期選擇範圍
            max: Date.now(), // //設置日期選擇範圍
            onChange: (val) => {
              console.log("選擇日期:" + val);
            },
            group: "輸入類型",
          },
          {
            title: "日期區間",
            field: "dateRangeVal",
            type: "date",
            range: true,
            onChange: (val) => {
              console.log("日期:" + val);
            },
            group: "輸入類型",
          },
        ],
        [
          {
            colSize: 12,
            render: (h) => {
              return (
                <el-alert
                  type="success"
                  title=""
                  style="line-height: 21px; padding: 0 0 5px 5px;"
                >
                  在任意位置可以使用render
                  jsx語法添加一些自定義组件或者代碼，比如現在的這段代碼
                </el-alert>
              );
            },
            group: "輸入類型",
          },
        ],
        [
          {
            dataKey: "top",
            title: "是否選擇",
            required: true,
            field: "switchVal",
            activeText: "已選擇",
            inactiveText: "未選擇",
            type: "switch",
            group: "輸入類型",
          },
          {
            title: "级聯",
            field: "cascaderVal", //注意上面formFields屬性cascader是數组
            placeholder: "配置數據源後自動绑定级聯",
            checkStrictly: true, //是否可以選擇任意一级，false只能選擇最後一级
            type: "cascader", //注意這個是值是數组
            dataKey: "tree_roles", //配置數據源(見菜單下拉框绑定設置中的级聯角色自定義sql)
            data: [], //绑定的數據源dataKey，
            group: "輸入類型",
          },
          {
            title: "樹形级聯",
            dataKey: "部門级聯",
            // 如果這裡绑定了data數據，後台不會加載此數據源
            data: [],
            field: "treeVal",
            multiple: true, //設置為多選
            readonly: false,
            type: "treeSelect",
            group: "輸入類型",
          },
          {
            dataKey: "city", //後台下拉框對應的數據字典編號
            data: [], //loadKey設置為true,會根據dataKey從後台的下拉框數據源中自動加載數據
            title: "下拉框",
            filter: true,
            //  required: true, //設置為必選項
            field: "selectVal",
            type: "select",
            group: "輸入類型",
          },
          {
            title: "自動完成",
            autocomplete: true, //設置為自動完成
            dataKey: "city",
            placeholder: "自動填充",
            data: [],
            //如果這裡绑定了data數據，後台不會加載此數據源
            // data: [
            //     { key: "北京市", value: "北京市" },
            //     { key: "上海市", value: "上海市" },
            // ],
            field: "selectAutoVal",
            type: "select",
            extra: {
              render: (h) => {
                return (
                  <el-popover
                    placement="top-start"
                    title="提示"
                    width="200"
                    trigger="hover"
                    content="下拉框選擇可以輸入，不存在的數據自動填入"
                  >
                    {{
                      reference:()=>{
                        return h(
                        <i
                          style="color:#9E9E9E;font-size:13px;"
                          onClick={() => {
                            this.popover();
                          }}
                          class="el-icon-warning-outline"
                        ></i>
                      )
                      }
                    }}
                  </el-popover>
                );
              },
            },
            group: "輸入類型",
          },
        ],
        [
          {
            //詳细配置見企業版文檔[表單select下拉框table搜索]:
            title: "下拉框table搜索",
            field: "selectTableVal",
            type: "selectTable",
            url: "api/Sys_Region/getPageData",
            group: "其他類型",
            columns: [
              { field: "code", title: "編碼", type: "string", width: 50 },
              { field: "name", title: "名稱", type: "string", width: 70 },
              { field: "level", title: "级别", type: "int", width: 40 },
              { field: "mername", title: "完整地址", type: "string", width: 140 },
            ],
            //選擇數據時
            onSelect: (rows) => {
              //给表單字段設置值
              this.formFields.selectTableVal = rows[0].name;
              this.formFields.selectNameVal = rows[0].mername;
              this.formFields.selectCodeVal = rows[0].code;

              this.formFields.selectTextVal = rows[0].name;
            },
            //輸入搜索時
            loadBefore: (param, callback) => {
              //多字段查詢、模糊查詢，見企業版本文檔，
              //http://doc.volcore.xyz/example/general/selectTable.html
              param.wheres.push({
                name: "mername",
                value: this.formFields.selectTableVal,
                displayType: "like",
              });
              callback(true);
            },
            paginationHide: false, //顯示分頁
            //colSize: 3, //設置寬度100%
          },
          {
            title: "搜索结果(只讀)",
            field: "selectCodeVal",
            readonly: true,
            group: "其他類型",
          },
          {
            title: "搜索结果2(只讀)",
            field: "selectNameVal",
            readonly: true,
            group: "其他類型",
          },
          {
            title: "搜索结果3(純文本)",
            field: "selectTextVal",
            type: "label",
            colSize: 4,
            group: "其他類型",
          },
        ],
        [
          {
            title: "多選(配置colSize屬性指定標籤寬度)",
            data: [],
            dataKey: "city",
            field: "selectListVal",
            type: "selectList", //上面selectListVal值為數组
            group: "其他類型",
            colSize: 12,
          },
        ],
        [
          {
            title: "備註",
            required: true,
            field: "Remark",
            placeholder: "你可以設置colSize屬性决定標籤的長度，可選值12/8/6/4",
            minRows: 5,
            maxRows: 10,
            type: "textarea",
            colSize: 12, //設置寬度100%
            group: "其他類型",
          },
        ],
        [
          {
            group: "編輯器類型",
            title: "編輯器",
            required: true,
            field: "editorValue",
            type: "editor",
            height: 200,
            url: "api/Demo_Order/Upload",
            colSize: 12, //設置寬度占比
          },
        ],
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-top: 15px;

  background: #f3f7fc;

  .content {
    border-radius: 5px;
    padding: 10px 0;
    background: #fff;
    // height: 100%;
    margin: 10px;
  }

  .header {
    margin: 0 13px 13px 13px;
  }
}
</style>
