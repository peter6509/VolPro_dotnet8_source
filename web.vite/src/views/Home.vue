<template>
  <div class="home-content" data-v-7f6868a7="">
    <el-scrollbar style="height: 100%">
      <div style="margin: 10px 0 -5px 12px; font-size: 14px; font-weight: bold">
        <i class="el-icon-warning-outline"></i> 功能說明
        <a class="contact" target="_blank">
          <!-- href="https://qm.qq.com/cgi-bin/qm/qr?k=t6OMhfBOnZ3urZiH4_keyIaKA98C9ieH&noverify=0&personal_qrcode_source=4" -->
          企業版可以面向更複雜的系统，支持分庫與動態無限分庫完美结合saas平台等功能，並提供技術支持、包括更完整的功能,
          <img src="/static/qq.png" style="height: 15px" />聯系方式：283591387</a
        >
      </div>
      <div class="home-container">
        <div class="home-list">
          <div class="list-item" v-for="(item, index) in list" :key="index">
            <div class="content">
              <div class="content-right">
                <div class="name">
                  <i class="el-icon-warning-outline"></i>{{ item.name }}
                </div>
                <div class="data">
                  {{ item.desc }}
                </div>
              </div>
              <div class="mouse-enter-class"></div>
            </div>
            <div
              :class="[
                item.type == '增强'
                  ? 'item-strengthen'
                  : item.type == '新增'
                  ? 'item-new'
                  : 'item-other',
              ]"
            >
              {{ item.type }}
            </div>
          </div>
        </div>
        <div class="home-list-left">
          <div style="font-weight: bold; margin-bottom: 13px; font-size: 14px">
            全新移動端版本發布
          </div>
          <div class="home-list-left-item" v-for="(item, index) in leftData" :key="index">
            <img :src="item.img" />
            <div class="data">{{ item.name }}({{ item.desc }})</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";
import { chart1, chart2, chart3, chart4 } from "./home/home-chart-options";
import * as echarts from "echarts";
import { useRouter, useRoute } from "vue-router";
import store from "../store/index";
import http from "@/../src/api/http.js";
export default {
  components: {},
  setup(props) {
    const radioValue = ref();

    const leftData = reactive([
      {
        name: "小程序端",
        img: "https://app-1256993465.cos.ap-nanjing.myqcloud.com/wechat.jpg",
        desc: "使用微信掃碼",
        type: "新增",
      },
      {
        name: "H5網頁端",
        img: "https://app-1256993465.cos.ap-nanjing.myqcloud.com/H5.png",
        desc: "使用瀏覽器掃碼",
        type: "新增",
      },
      {
        name: "安卓android",
        img: "https://app-1256993465.cos.ap-nanjing.myqcloud.com/H5.png",
        desc: "使用瀏覽器掃碼",
        type: "新增",
      },
      {
        name: "蘋果ios端",
        desc: "暫未開放",
        type: "新增",
      },
    ]);

    const list = reactive([
      {
        name: "租户管理",
        type: "新增",
        desc:
          "支持租户功能，並支持一個租户一個獨立數據庫,框架全自動管理每個租户及數據庫創建",
      },
      {
        name: "移動端開發",
        desc: "移動端基於uniapp開發,同樣自動生成代碼,小程序搜：vol開發框架",
        type: "基礎",
      },
      {
        name: "審批流程",
        desc:
          "支持按條件分支、多部門、多角色、多用户、並簽、或簽、终止、回退、重新發起流程、反審等功能",
        type: "增强",
      },
      {
        name: "自定義大屏設計器",
        type: "新增",
        desc: "可以在線設計各種大屏數據,支持大屏菜單權限",
      },
      {
        name: "打印功能",
        type: "新增",
        desc: "簡單配置即可實現單表、批量打印、主從表一對多打印、二维碼打印、標籤打印等",
      },
      {
        name: "工作台設計器",
        type: "新增",
        desc: "零代碼自定義用户工作台,支持動態查詢、sql、接口等方式實現數據绑定",
      },
      {
        name: "一對多代碼生成",
        desc: "不需要寫代碼即可生成一對多,見菜單[一對多生成]",
        type: "新增",
      },
      {
        name: "多對多代碼生成",
        desc: "不需要寫代碼即可生成多對多，並支持自定義擴展配置",
        type: "新增",
      },
      {
        name: "業務分庫",
        desc:
          "只需要簡單配置即可實現按業務劃分不同的數據庫，並支持同是使用sqlserver、mysql、pgsql等數據庫",
        type: "增强",
      },
      {
        name: "動態無限分庫",
        desc:
          "自動生成創建動態據庫(支持一個租户一個數據庫，並由框架全自動管理每個數據庫)",
        type: "增强",
      },
      {
        name: "菜單數據權限",
        desc: "支持每個菜單對應不同的數據權限過濾，具體配置見代碼中的文檔",
        type: "新增",
      },
      {
        name: "角色數據權限",
        desc: "支持直接配置角色數據權限,並支持自定義數據權限，可按需求灵活處理權限",
        type: "新增",
      },
      {
        name: "字段權限",
        type: "新增",
        desc: "支持配置不同角色字段權限(每個角色看到的字段不一樣)",
      },
      {
        name: "用户自定義查詢",
        desc: "支持用户自定義配置组合查詢、分组查詢、排序、表格固定、數據篩選等功能",
        type: "新增",
      },
      {
        name: "自動單據編碼",
        desc: "支持多種編碼格式，自動生成編碼單據號，具體配置見代碼中的文檔",
        type: "新增",
      },
      {
        name: "用户在線實時顯示",
        desc: "實時顯示在線用户並且可以强制將用户下線",
        type: "新增",
      },
      {
        name: "數據庫與缓存支持",
        type: "基礎",
        desc: "sqlserver、mysql、pgsql、oracle、redis",
      },
      {
        name: "支持國密算法加密",
        type: "新增",
        desc: "支持國密算法加密SM1、SM2、SM3、SM4、SM7、SM9",
      },
      {
        name: "前後端請求參數加密	",
        type: "新增",
        desc: "為保證提交數據安全支持前端請求加密後提交，後台自動解密",
      },
      {
        name: "多组織架構、多角色",
        desc: "支持用户分配多组織、多角色並支持层级關系",
        type: "增强",
      },
      { name: "國際化", desc: "後台生成語言包,前後端實時顯示翻譯", type: "新增" },
      {
        name: "新窗口編輯功能",
        type: "新增",
        desc: "默認編輯彈出框編輯,支持tab選項卡編輯",
      },
      {
        name: "行内編輯模式",
        type: "新增",
        desc: "可直接在生成頁面的表格上進行編輯,由代碼生成器完成",
      },
      {
        name: "數據隔離、邏輯删除",
        type: "新增",
        desc: "支持配置文件設置自定義業務表數據隔離、邏輯删除",
      },
      // {
      //   name: "其他",
      //   type: "新增",
      //   desc: "100%提供源碼、技術支持、二次開發、銷售商業使用及正規發票",
      // },
    ]);

    const { proxy } = getCurrentInstance();
    let dateArr = new Array(10).fill(0).map((x, i) => {
      let date = proxy.base.getDate();
      return proxy.base.addDays(date, i * -1);
    });

    const getChartData = () => {
      return {
        title: {
          text: "收支記錄",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          padding: 5,
          textStyle: {
            fontSize: 12,
            // color: '#afe3ff'
          },
          itemHeight: 9,
          itemWidth: 12,
          icon: "roundRect", // 'circle',
          data: ["收入", "支出"],
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false, // 不顯示坐標軸刻度線
          },
          axisLine: {
            show: false, // 不顯示坐標軸線
          },
          type: "category",
          boundaryGap: false,
          data: dateArr, // ['05-17', '05-18', '05-19', '05-20', '05-21', '05-22', '05-23'],
          axisLabel: {
            //y軸文字的配置
            textStyle: {
              color: "#a7a7a7",
              margin: 15,
            },
          },
        },
        grid: {
          left: 50,
          bottom: 20,
          top: 40,
          right: 50,
        },
        yAxis: {
          splitNumber: 3,
          splitLine: { show: false },
          type: "value",
          axisLabel: {
            //y軸文字的配置
            textStyle: {
              color: "#a7a7a7",
              margin: 15,
            },
          },
        },
        series: [
          {
            name: "收入",
            type: "line",
            smooth: true,
            lineStyle: {
              // 陰影部分
              shadowOffsetX: 0, // 折線的X偏移
              shadowOffsetY: 6, // 折線的Y偏移
              shadowBlur: 8, // 折線模糊
              shadowColor: "#e3d6fd", //折線顏色
            },

            showSymbol: false,

            emphasis: {
              focus: "series",
            },
            data: [
              30,
              765,
              456,
              697,
              23,
              564,
              400,
              345,
              478,
              123,
              45,
              789,
              231,
              654,
              98,
              34,
              56,
              78,
              192,
              321,
              645,
              700,
              213,
              546,
              600,
              312,
            ],
          },
          {
            name: "支出",
            type: "line",
            smooth: true,
            lineStyle: {
              // 陰影部分
              shadowOffsetX: 0, // 折線的X偏移
              shadowOffsetY: 7, // 折線的Y偏移
              shadowBlur: 8, // 折線模糊
              shadowColor: "#9fceff", //折線顏色
            },

            itemStyle: {
              color: "#2196F3",
            },
            showSymbol: false,

            emphasis: {
              focus: "series",
            },
            data: [
              0,
              456,
              789,
              280,
              800,
              470,
              213,
              546,
              98,
              312,
              432,
              567,
              891,
              234,
              561,
              784,
              325,
              647,
              892,
              135,
              462,
              781,
              700,
              236,
              578,
              899,
            ],
          },
        ],
      };
    };

    const chartPie = () => {
      return {
        color: [
          "#95a2ff",
          "#3cb9fc	",
          "#76da91",
          "#fae768",
          "#87e885",
          "#87e125",
          "#f89588",
        ],
        tooltip: {
          trigger: "item",
        },
        legend: {
          padding: 5,
          textStyle: {
            fontSize: 12,
            // color: '#afe3ff'
          },
          itemHeight: 9,
          itemWidth: 12,
          icon: "roundRect", // 'circle',
          top: "center",
          orient: "vertical",
          left: "left",
        },
        grid: {
          bottom: 120,
          top: -10,
        },
        series: [
          {
            name: "收入",
            type: "pie",
            center: ["50%", "50%"], //餅圖位置
            radius: ["60%", "75%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            label: {
              normal: {
                show: true,
                position: "center",
                color: "#4c4a4a",
                formatter: "{total|" + 20000 + "}" + "\n\r" + "{active|累計收入}",
                rich: {
                  total: {
                    fontSize: 35,
                    fontWeight: 700,
                    fontFamily: "微軟雅黑",
                    color: "#454c5c",
                  },
                  active: {
                    fontFamily: "微軟雅黑",
                    fontSize: 16,
                    color: "#6c7a89",
                    lineHeight: 30,
                  },
                },
              },
              emphasis: {
                //中間文字顯示
                show: true,
              },
            },
            lableLine: {
              normal: {
                show: false,
              },
              emphasis: {
                show: true,
              },
              tooltip: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 200, name: "昨天收入" },
              { value: 600, name: "本周收入" },
              { value: 735, name: "本月收入" },
              { value: 580, name: "本季收入" },
              { value: 884, name: "本年收入" },
              { value: 900, name: "累計收入" },
              { value: 300, name: "其他收入" },
            ],
          },
        ],
      };
    };

    onMounted(() => {});
    return {
      list,
      leftData,
      radioValue,
    };
  },
};
</script>
<style lang="less" scoped>
// @import './home/index.less';

.home-content {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #f3f7fb;

  .home-container {
    display: flex;
  }

  .home-list-left {
    text-align: center;
    width: 200px;
    margin: 12px;
    margin-left: 0;
    border-radius: 5px;
    padding-top: 10px;
    margin-bottom: 24px;
    background: #fff;
    .data {
      margin-top: 5px;
      font-size: 13px;
    }
    img {
      width: 100px;
    }
    img:first-child {
      width: 130px;
    }
    .home-list-left-item {
      margin-bottom: 30px;
    }
  }
  .home-list {
    flex: 1;
    width: 0;
    margin: 12px;
    display: grid;
    -moz-column-gap: 12px;
    column-gap: 12px;
    grid-template-columns: repeat(4, auto);
  }

  .list-item {
    display: flex;
    position: relative;
    cursor: pointer;
    margin-bottom: 12px;
    transition: transform 0.8s;

    .content {
      flex: 1;
      width: 0;
      position: relative;
      height: 110px;
      // padding-left: 40px;
      background: #ffffff;
      display: flex;
      align-items: center;
      transition: all 1.5s;
      border-radius: 5px;
      overflow: hidden;

      .content-right {
        color: #1d252f;
        padding: 0 20px;

        .el-icon-warning-outline {
          margin-right: 5px;
        }
      }

      .name {
        transition: transform 0.5s;
        color: #434343;
        font-size: 14px;
        font-weight: bold;
        padding-bottom: 5px;
      }

      .data {
        font-size: 12px;
        font-family: Source Han Sans CN, sans-serif;
        color: #6f6f6f;
      }
    }

    .mouse-enter-class {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 40px;
      border-bottom: 3px #0763ee solid;
      transition: 1s;
    }
  }
}

.list-item:hover {
  transform: scale(1.04);

  .content {
    background: #ecf5f9;

    .mouse-enter-class {
      width: 100%;
    }
  }
}

.home-list-content {
  margin: -12px 12px;
  background: #ffff;
  padding: 20px;
  display: flex;
  margin-bottom: 12px;
}

.contact {
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin-left: 24px;
  color: #8e8888;

  img {
    height: 15px;
    margin-bottom: -3px;
    margin-right: 5px;
  }
}

.item-strengthen,
.item-new,
.item-other {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  padding: 2px 10px;
  background: #daf3ff;
  border-bottom-left-radius: 6px;
  color: #339aed;
  border-top-right-radius: 5px;
}

.item-new {
  background: #ffebe9;
  color: #f94638;
}

.item-other {
  background: #e1fae2;
  color: #2ad431;
}

.chart-line {
  height: 250px;
  background: white;
  flex: 1;
  position: relative;
  margin-right: 15px;
  background: #fff;
}
.radio-group {
  position: absolute;
  right: 50px;
  top: 0;
  z-index: 999;
}
</style>
