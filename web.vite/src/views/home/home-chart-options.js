var chart1 = {
    title: {
        text: "框架集成及開發環境",
        left: 'left',
        padding: 15,
    },
    tooltip: {
      
        trigger: 'item'
    },
    legend: {
      top:"middle",
      orient: 'vertical',
      left: 'left',
        icon: "circle",   //  這個字段控制形状  類型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        itemWidth: 10,  // 設置寬度
        itemHeight: 10, // 設置高度
        itemGap: 7,// 設置間距
        padding: [50, 0, 15, 0] //圖例距離
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top:'20%',
      containLabel: true
  },
    series: [
        {
          center: ['60%', '55%'], 
            name: '框架',
            type: 'pie',
            radius: ['55%', '75%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 820, name: '.NetCore' },
                { value: 900, name: '.Net6' },
                { value: 435, name: 'Dapper' },
                { value: 535, name: 'EntityFramework' },
                { value: 585, name: 'JWT' },
                { value: 425, name: 'Redis' },
                { value: 735, name: 'Vue3.0' },
                { value: 120, name: 'Vuex' },
                { value: 300, name: 'Element plus' }
            ]
        }
    ]
}



var chart2 = {
    title: {
     //   text: '這裡是首頁'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐標軸指示器，坐標軸觸發有效
            type: 'shadow'        // 默認為直線，可選為：'line' | 'shadow'
        }
    },
    legend: {
        data: ['3.0下載量', '2.0下載量'],
        padding: [0, 0, 15, 0] //圖例距離
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'13%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: [ '2015', '2016', '2017', '2018', '2019', '2020', '2021']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '3.0下載量',
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: {

                normal: {
                    barBorderRadius: [4, 4, 0, 0]
                }
            },
            data: [ 730, 620, 420, 932, 701, 834, 890]
        },
        {
            name: '2.0下載量',
            type: 'bar',

            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            data: [230, 210, 120, 132, 101, 134, 90]
        }
    ]
}
var chart3 = {
    title: {
        text: '框架支持功能(Vue2.0、Vue3.0版本)',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: 'bottom',
        icon: "circle",   //  這個字段控制形状  類型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        itemWidth: 10,  // 設置寬度
        itemHeight: 10, // 設置高度
        itemGap: 7,// 設置間距
        padding: [0, 0, 10, 0] //圖例距離
    },
    series: [
        {

            name: '框架支持功能(Vue2.0、Vue3版本)',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 748, name: '多租户' },
                { value: 435, name: '多角色' },
                { value: 580, name: '多數據庫' },
                { value: 280, name: '主從分庫' },
                { value: 284, name: '國際化' },
                { value: 300, name: 'App/H5開發' },
                { value: 200, name: 'Redis' },
                { value: 600, name: 'Sqlserver' },
                { value: 400, name: 'Mysql' },
                { value: 100, name: 'Oracle' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}
var chart4={
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'13%',
        containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [
      {
        name: 'Direct',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [320, 302, 301, 334, 390, 330, 320]
      },
      {
        name: 'Mail Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Affiliate Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [150, 212, 201, 154, 190, 330, 410]
      },
      {
        name: 'Search Engine',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [820, 832, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
export { chart1, chart2, chart3,chart4 }