/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 10:40:26
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-09 10:50:02
 */
// import { hiprint } from "vue-plugin-hiprint";
import hiprintPackage from "./vue-plugin-hiprint.js" // "vue-plugin-hiprint";
var hiprint=hiprintPackage.hiprint;
import common from "@/uitils/common.js";
import store from '@/store/index';
export const provider2 = function (options) {
  console.log(options);
  let date=common.getDate();
  let datetime=common.getDate(true);
  let user=store.getters.getUserInfo();
  if (!user) {
    user='--'
  }else{
    user=user.userName;
  }
  var addElementTypes = function (context) {
    context.removePrintElementTypes("providerModule2");
    context.addPrintElementTypes("providerModule2", [
      new hiprint.PrintElementTypeGroup("其他", [
        // {
        //   tid: "providerModule2.table",
        //   title: "訂單數據",
        //   type: "table",
        //   options: {
        //     field: "table",
        //     fields: [
        //       { text: "名稱", field: "NAME" },
        //       { text: "數量", field: "SL" },
        //       { text: "規格", field: "GG" },
        //       { text: "條碼", field: "TM" },
        //       { text: "單價", field: "DJ" },
        //       { text: "金額                                                                                                                                                                                                                                                 ", field: "JE" },
        //       { text: "備註", field: "DETAIL" },
        //     ],
        //   },
        //   columns: [
        //     [
        //       { title: "名稱", align: "center", field: "NAME", width: 100 },
        //       { title: "數量", align: "center", field: "SL", width: 100 },
        //       { title: "條碼", align: "center", field: "TM", width: 100 },
        //       { title: "規格", align: "center", field: "GG", width: 100 },
        //       { title: "單價", align: "center", field: "DJ", width: 100 },
        //       { title: "金額                                                                                                                                                                                                                                                 ", align: "center", field: "JE", width: 100 },
        //       { title: "備註", align: "center", field: "DETAIL", width: 100 },
        //     ],
        //   ],
        //   footerFormatter: function (options, rows, data, currentPageGridRowsData) {
        //     console.log(currentPageGridRowsData);
        //     if (data && data["totalCap"]) {
        //       return `<td style="padding:0 10px" colspan="100">${"應收金額                                                                                                                                                                                                                                                 大寫: " + data["totalCap"]}</td>`;
        //     }
        //     return '<td style="padding:0 10px" colspan="100">應收金額                                                                                                                                                                                                                                                 大寫: </td>';
        //   },
        // },
        { tid: "providerModule2.customText", title: "文本", customText: "自定義文本", custom: true, type: "text" },
        {
          tid: "providerModule2.longText",
          title: "長文本",
          type: "longText",
          options: {
            field: "test.longText",
            width: 200,
            testData: "長文本分頁/不分頁測試",
          },
        },
      // ]),
      // new hiprint.PrintElementTypeGroup("輔助", [
        {
          tid: "providerModule2.hline",
          title: "横線",
          type: "hline",
        },
        {
          tid: "providerModule2.vline",
          title: "竖線",
          type: "vline",
        },
        {
          tid: "providerModule2.rect",
          title: "矩形",
          type: "rect",
        },
        {
          tid: "providerModule2.oval",
          title: "椭圆",
          type: "oval",
        },
        {
          tid: 'providerModule2.date',
          title: '當前日期',
          data: '',
          type: 'text',
          options: {
            field: 'sys:date',
            testData: date,
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle'
          }
        },
        {
          tid: 'providerModule2.datetime',
          title: '當前時間',
          data: '',
          type: 'text',
          options: {
            field: 'sys:datetime',
            testData: datetime,
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            width: 160,
            textAlign: 'left',
            textContentVerticalAlign: 'middle'
          }
        },
        {
          tid: 'providerModule2.user',
          title: '當用用户',
          data: '',
          type: 'text',
          options: {
            field: 'sys:user',
            testData:user,
            height: 16,
            fontSize: 6.75,
            fontWeight: '700',
            textAlign: 'left',
            textContentVerticalAlign: 'middle'
          }
        },
      ]),
    ]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};
