/*
 *Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,此处任何更改都可能导致被代码生成器覆盖
 *所有业务编写全部应在Partial文件夹下sf_project_templateService与Isf_project_templateService中编写
 */
using VolPro.sf_project.IRepositories;
using VolPro.sf_project.IServices;
using VolPro.Core.BaseProvider;
using VolPro.Core.Extensions.AutofacManager;
using VolPro.Entity.DomainModels;

namespace VolPro.sf_project.Services
{
    public partial class sf_project_templateService : ServiceBase<sf_project_template, Isf_project_templateRepository>
    , Isf_project_templateService, IDependency
    {
    public static Isf_project_templateService Instance
    {
      get { return AutofacContainerModule.GetService<Isf_project_templateService>(); } }
    }
 }
