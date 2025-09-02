<template>
  <div id="main" style="width:800px;height:600px">
      home
  </div>
</template>
<script setup>
import { ref,onMounted } from 'vue';
import * as echarts from 'echarts';
import * as chinaJSON from './china.json';
echarts.registerMap('china', chinaJSON )
onMounted(()=>{
  init()
})
const init=()=>{
  var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
// 引入航線所用的飛機箭頭 用於symbol屬性
const planePath =
  'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

myChart.setOption({
  // geo地理坐標系组件 支持在地理坐標系上繪制散點圖，線集
  geo: {
    map: 'china', // 中國地圖
    roam: true, // 是否開啟放大缩小/拖拽功能
    //地圖的位置調試
    left: 150,
    top: 120,
    right: 150,
    bottom: 0,
    // 缩放比列
    zoom: 1.12,
    // 地圖中心點位置
    layoutCenter: ['50%', '50%'],
    //地圖上的文字的設置
    label: {
      show: true,
      color: 'white',
      fontSize: 12,
    },
    // itemStyle地圖區域的多邊形 圖形樣式
    itemStyle: {
      areaColor: '#12235c', // 地圖區域的顏色
       borderColor: '#2ab8ff', // 圖形的描邊顏色
      borderColor: 'rgba(147, 235, 248, 1)',
      borderWidth: 0.8,
     shadowColor: 'rgba(128, 217, 248, .8)',
      shadowOffsetX: -2,
      shadowOffsetY: 2,
      shadowBlur: 10,
      opacity: 0.9,
    },
    //地圖高亮的效果
    emphasis: {
      label: {
        color: 'white',
       // fontSize: 32,
        // fontWeight: 'bold',
      },
      itemStyle: {
        // areaColor: '#5470c6',
        borderWidth: 2,
        borderType: 'dashed', // 高亮時虚線邊框
      },
      // focus: 'self', // 鼠標移入地區，其餘地區淡出
    },
  },
  //布局位置
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  // 航線的設置 series-lines
  series: [
    {
      type: 'lines', //航線的系列
      data: [
        {
          // 北京->河南
          coords: [
            [116.405285, 39.904989], // 起點
            [113.665412, 34.757975], // 终點
          ],
        },
        {
          // 河南->北京
          coords: [
            [113.665412, 34.757975],
            [116.405285, 39.904989],
          ],
        },
        {
          // 北京->黑龙江
          coords: [
            [116.405285, 39.904989],
            [126.642464, 45.756967],
          ],
        },
        {
          // 黑龙江->北京
          coords: [
            [126.642464, 45.756967],
            [116.405285, 39.904989],
          ],
        },
        {
          // 河南->浙江
          coords: [
            [113.665412, 34.757975],
            [120.153576, 30.287459],
          ],
        },
        {
          // 浙江->河南
          coords: [
            [120.153576, 30.287459],
            [113.665412, 34.757975],
          ],
        },
        {
          // 浙江->台湾
          coords: [
            [120.153576, 30.287459],
            [121.509062, 25.044332],
          ],
        },
        {
          // 北京->新疆
          coords: [
            [116.405285, 39.904989],
            [87.617733, 43.792818],
          ],
        },
        {
          // 新疆->北京
          coords: [
            [87.617733, 43.792818],
            [116.405285, 39.904989],
          ],
        },
        {
          // 河南->四川
          coords: [
            [113.665412, 34.757975],
            [104.065735, 30.659462],
          ],
        },
        {
          // 四川->河南
          coords: [
            [104.065735, 30.659462],
            [113.665412, 34.757975],
          ],
        },
        {
          // 四川->西藏
          coords: [
            [104.065735, 30.659462],
            [91.132212, 29.660361],
          ],
        },
        {
          // 四川->廣東
          coords: [
            [104.065735, 30.659462],
            [113.280637, 23.125178],
          ],
        },
        {
          // 廣東->四川
          coords: [
            [113.280637, 23.125178],
            [104.065735, 30.659462],
          ],
        },
      ],
      // 開啟動畫特效
      effect: {
        show: true,
        period: 5, // 箭頭指向速度，值越小速度越快
        trailLength: 0, // 特效尾迹長度[0,1]值越大，尾迹越長重
        // symbol: 'arrow', // 箭頭圖標
        symbol: planePath, // 箭頭圖標使用引入的箭頭
        symbolSize: 18,
      },
      // 線路统一的樣式設置
      lineStyle: {
        color: '#00eaff',
        width: 1.5, //尾迹線條寬度
        opacity: 0.7, //尾迹線條透明度
        curveness: 0.3, //尾迹線條曲直度
      },
    },
  ],
})
}


</script>