/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹MES_ProcessReportController编写
 */
using Microsoft.AspNetCore.Mvc;
using VolPro.Core.Controllers.Basic;
using VolPro.Entity.AttributeManager;
using VolPro.MES.IServices;
namespace VolPro.MES.Controllers
{
    [Route("api/MES_ProcessReport")]
    [PermissionTable(Name = "MES_ProcessReport")]
    public partial class MES_ProcessReportController : ApiBaseController<IMES_ProcessReportService>
    {
        public MES_ProcessReportController(IMES_ProcessReportService service)
        : base(service)
        {
        }
    }
}

