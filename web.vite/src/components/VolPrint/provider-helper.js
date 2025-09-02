/*
 * @Description: 動態創建 provider
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-04-02 14:11:51
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-02 16:10:18
 */

// import { hiprint } from "vue-plugin-hiprint";
import hiprintPackage from "./vue-plugin-hiprint.js" // "vue-plugin-hiprint";
var hiprint=hiprintPackage.hiprint;
/**
 * 這是個說明文檔, 用於說明如何自定義 provider
 * 首先需要理解清楚, 自定義 provider 的格式是什么樣的
 * 我在 【vue-plugin-hiprint】如何自定義可拖拽元素 provider 一文中, 已經詳细介绍了
 * 鏈接: https://mp.weixin.qq.com/s/n9i1j8hhVJvnlfJRPRtWog
 * 格式如下:
 * @param {Object} options 這是我们實際傳入的參數, 一般是一個對象, 裡面包含了一些配置信息
 * @return {Object} 返回一個對象, 裡面包含了 addElementTypes 方法
 */
// eslint-disable-next-line no-unused-vars
const 格式 = function (options) {
  // 這裡的 options 是一個對象, 是我们在使用時傳入的
  // 當然你可以自定義有幾個參數 如: function (map,options) {}
  console.log(options);
  // 這裡的 context 是一個對象, 是由 hiprint 内部執行時回調回來的.
  // 我们可以 log 出來看看
  var addElementTypes = function (context) {
    console.log(context);
  };
  return {
    addElementTypes: addElementTypes,
  };
};

// --------------- 以下是實战示例 ----------------

/**
 * @description 這是一個示例, 如果後端返回的數據,與我们需要的格式不對應, 那么我们可以在這裡進行轉換
 */
const PRINT_ELEMENT_TYPE_MAP = {
  // 比如後端返回元素類型的是 "txt", 但是我们需要的是 "text"
  txt: "text",
  img: "image",
  // 比如後端返回的 "二维碼", 但是我们需要的是 "text"
  qrcode: "text",
  // 比如後端返回的 "條形碼", 但是我们需要的是 "text"
  barcode: "text",
  table: "table",
  tableCustom: "table",
  hLine: "hline",
  vLine: "vline",
  rect: "rect",
  oval: "oval",
};

/**
 * 創建一個 provider
 * @param {*} key 這個 key 是用於創建 "唯一" 的 "tid" 的, 一般是用於區分不同的 provider
 * @param {*} options 這個就需要根據實際情况來定義了,根據項目實際情况與後端协商定義
 * @returns Object
 */
const createProvider = function (key, options) {
  const addElementTypes = function (context) {
    // 先清空, 避免重複添加. 如果有特殊需求, 可以不清空
    context.removePrintElementTypes(key);
    // 實際添加 一般分為以下幾步:
    // 1. 添加一個key (用於創建 "唯一" 的 "tid" ) -- 對象包含數组: {"key",[]}
    // 2. 添加一個分组 (就是為了给元素分组, 便於展示) -- 對象包含數组: {"分组名稱",[]}
    // 3. 添加分组下的元素數组 (實際的元素操作,都在這裡進行) -- 數组包含對象 [{元素格式},{元素格式}]

    // 反過來說, 我们就是需要 先 "創建元素數组", 把這個"元素數组"push到 "分组對象"中, 最後把這個"分组對象"push到 "key數组"中
    // 反過來說, 我们就是需要 先 "創建元素數组", 把這個"元素數组"push到 "分组對象"中, 最後把這個"分组對象"push到 "key數组"中
    // 反過來說, 我们就是需要 先 "創建元素數组", 把這個"元素數组"push到 "分组對象"中, 最後把這個"分组對象"push到 "key數组"中

    // 所以我们先來 第 3 步: 創建元素數组
    // 這裡的 options.config 是一個數组, 裡面包含了後端返回的元素配置信息
    let printElements = options.printElements.map((item) => {
      // 提出來, 方便處理 二维碼 條形碼;
      // 如果和後端约定好,那么就更簡單了,直接把後端返回的數據,直接赋值给 options
      let options = {
        title: item.title, // 在 options 中添加 title, 是可以清空的
        field: item.field,
        testData: item.testData,
        ...item.options, // 可選參數之類的, 或者參數都在這裡面
      };
      // 有些元素可以不設置寬高的,比如 table
      item.width && (options.width = item.width);
      item.height && (options.height = item.height);
      // 特殊處理 二维碼 條形碼
      if (["qrcode", "barcode"].includes(item.type)) {
        options.textType = item.type;
      }
      //   基礎打印元素選項
      let printElement = {
        tid: `${key}.${item.id}`, // 確保不重複就行
        title: item.title, // 這個 title 清空了,還是會有這個默認值
        type: PRINT_ELEMENT_TYPE_MAP[item.type], // 轉換後端返回的元素類型
        options: options,
      };
      // 特殊處理 表格 (表格參比较多咯~~~)
      if (["table", "tableCustom"].includes(item.type)) {
        // 根據實際情况 進行處理
        if (item.columns) {
          printElement.columns = item.columns;
        } else {
          printElement.columns = [
            [
              { align: "center", width: 100 },
              { align: "center", width: 100 },
            ],
          ];
        }
        return printElement;
      }
      return printElement;
    });
    // 第 2 步: 創建分组對象
    // 如果 是多個分组, 就再套一层循環就好了
    let printElementGroup = new hiprint.PrintElementTypeGroup(options.groupName, printElements);
    // 第 1 步: 添加到 key 數组中
    context.addPrintElementTypes(key, [printElementGroup]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};

/**
 * 創建多個 provider
 * @param {*} optionList 參數列表
 * @returns Array
 */
const createProviderList = function (optionList) {
  const providers = optionList.map((item) => {
    return createProvider(item.key, item.options);
  });
  // 當你不清楚的時候, 可以 log 出來看看
  return providers;
};

// --------------- 以上是實战示例 ----------------

export default { createProvider, createProviderList };
