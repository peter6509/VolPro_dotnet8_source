/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Sys_WorkFlowTableController编写
 */
using Microsoft.AspNetCore.Mvc;
using VolPro.Core.Controllers.Basic;
using VolPro.Entity.AttributeManager;
using VolPro.Sys.IServices;
namespace VolPro.Sys.Controllers
{
    [Route("api/Sys_WorkFlowTable")]
    [PermissionTable(Name = "Sys_WorkFlowTable")]
    public partial class Sys_WorkFlowTableController : ApiBaseController<ISys_WorkFlowTableService>
    {
        public Sys_WorkFlowTableController(ISys_WorkFlowTableService service)
        : base(service)
        {
        }
    }
}

