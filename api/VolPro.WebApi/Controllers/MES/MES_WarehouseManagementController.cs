/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹MES_WarehouseManagementController编写
 */
using Microsoft.AspNetCore.Mvc;
using VolPro.Core.Controllers.Basic;
using VolPro.Entity.AttributeManager;
using VolPro.MES.IServices;
namespace VolPro.MES.Controllers
{
    [Route("api/MES_WarehouseManagement")]
    [PermissionTable(Name = "MES_WarehouseManagement")]
    public partial class MES_WarehouseManagementController : ApiBaseController<IMES_WarehouseManagementService>
    {
        public MES_WarehouseManagementController(IMES_WarehouseManagementService service)
        : base(service)
        {
        }
    }
}

