/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹Sys_WorkFlowController编写
 */
using Microsoft.AspNetCore.Mvc;
using VolPro.Core.Controllers.Basic;
using VolPro.Entity.AttributeManager;
using VolPro.Sys.IServices;
namespace VolPro.Sys.Controllers
{
    [Route("api/Sys_WorkFlow")]
    [PermissionTable(Name = "Sys_WorkFlow")]
    public partial class Sys_WorkFlowController : ApiBaseController<ISys_WorkFlowService>
    {
        public Sys_WorkFlowController(ISys_WorkFlowService service)
        : base(service)
        { 
        }
    }
}

