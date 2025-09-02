﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using VolPro.Core.Controllers.Basic;
using System.Linq;

namespace VolPro.WebApi.Controllers.Dashboard
{
    /// <summary>
    /// 工作台自定义接口(测试)
    /// </summary>
    [Route("api/dashboard")]
    public class DashboardController : VolController
    {
        public DashboardController()
        {

        }

        /// <summary>
        /// 获取柱状图的数据
        /// </summary>
        /// <returns></returns>
        [HttpGet, HttpPost, Route("getBarData")]
        public IActionResult GetBarData(DateTime? date1, DateTime? date2, string filterType)
        {
            var data = Enumerable.Range(0, 12)
            .Select(i => new
            {
                日期 = DateTime.Today.AddMonths(i * -1).ToString("yyyy.MM"),
                入库数量 = new Random().Next(1000, 9999),
                出库数量 = new Random().Next(1000, 9999)
            })
            .ToArray();
            return Json(data);
        }
        /// <summary>
        /// 获取栅格01的数据
        /// </summary>
        /// <returns></returns>
        [HttpGet, HttpPost, Route("getGridData")]
        public IActionResult GetGridData(DateTime? date1, DateTime? date2, string filterType)
        {
            var data = new List<object>() {
               new  { name="待处理事项",value=new Random().Next(1000,9999)},
                new {name="已处理事项",value=2300},
                new {name="待回复消息",value=2400},
                new {name="已回复消息",value=1500},
                new {name="待审批事项",value=1800},
                new {name="已审批事项",value=1200},
                new {name="数量总计",value=9000}
            };
            return Json(data);
        }

        [HttpGet, HttpPost, Route("getGridData2")]
        public IActionResult GetGridData2(DateTime? date1, DateTime? date2, string filterType)
        {
            var data = new List<int>() {
            100,200,300,400,500,600,700,800,900
            };
            return Json(new
            {
                value = 9990,
                unit = "箱",
                bottom = new string[] { "text1:1000", "text2:2000" },
                data
            });
        }
    }
}
