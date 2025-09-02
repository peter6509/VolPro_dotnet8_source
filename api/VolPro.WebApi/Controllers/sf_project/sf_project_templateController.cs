/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *如果要增加方法请在当前目录下Partial文件夹sf_project_templateController编写
 */
using Microsoft.AspNetCore.Mvc;
using VolPro.Core.Controllers.Basic;
using VolPro.Entity.AttributeManager;
using VolPro.sf_project.IServices;
namespace VolPro.sf_project.Controllers
{
    [Route("api/sf_project_template")]
    [PermissionTable(Name = "sf_project_template")]
    public partial class sf_project_templateController : ApiBaseController<Isf_project_templateService>
    {
        public sf_project_templateController(Isf_project_templateService service)
        : base(service)
        {
        }
    }
}

