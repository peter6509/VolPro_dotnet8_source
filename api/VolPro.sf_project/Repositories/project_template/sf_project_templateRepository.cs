/*
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *Repository提供数据库操作，如果要增加数据库操作请在当前目录下Partial文件夹sf_project_templateRepository编写代码
 */
using VolPro.sf_project.IRepositories;
using VolPro.Core.BaseProvider;
using VolPro.Core.EFDbContext;
using VolPro.Core.Extensions.AutofacManager;
using VolPro.Entity.DomainModels;

namespace VolPro.sf_project.Repositories
{
    public partial class sf_project_templateRepository : RepositoryBase<sf_project_template> , Isf_project_templateRepository
    {
    public sf_project_templateRepository(SysDbContext dbContext)
    : base(dbContext)
    {

    }
    public static Isf_project_templateRepository Instance
    {
      get {  return AutofacContainerModule.GetService<Isf_project_templateRepository>(); } }
    }
}
