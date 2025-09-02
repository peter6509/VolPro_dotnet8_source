/*
 *所有关于Sys_WorkFlowTable类的业务代码应在此处编写
*可使用repository.调用常用方法，获取EF/Dapper等信息
*如果需要事务请使用repository.DbContextBeginTransaction
*也可使用DBServerProvider.手动获取数据库相关信息
*用户信息、权限、角色等使用UserContext.Current操作
*Sys_WorkFlowTableService对增、删、改查、导入、导出、审核业务代码扩展参照ServiceFunFilter
*/
using VolPro.Core.BaseProvider;
using VolPro.Core.Extensions.AutofacManager;
using VolPro.Entity.DomainModels;
using System.Linq;
using VolPro.Core.Utilities;
using System.Linq.Expressions;
using VolPro.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using VolPro.Sys.IRepositories;
using VolPro.Core.ManageUser;
using VolPro.Core.WorkFlow;
using System;
using VolPro.Core.DBManager;
using System.Collections.Generic;

namespace VolPro.Sys.Services
{
    public partial class Sys_WorkFlowTableService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISys_WorkFlowTableRepository _repository;//访问数据库
        private readonly ISys_WorkFlowTableStepRepository _stepRepository;//访问数据库
        [ActivatorUtilitiesConstructor]
        public Sys_WorkFlowTableService(
            ISys_WorkFlowTableRepository dbRepository,
            IHttpContextAccessor httpContextAccessor,
             ISys_WorkFlowTableStepRepository stepRepository
            )
        : base(dbRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = dbRepository;
            _stepRepository = stepRepository;
            //多租户会用到这init代码，其他情况可以不用
            //base.Init(dbRepository);
        }
        /// <summary>
        /// 待审核、审批中的数据
        /// </summary>
        /// <param name="queryable"></param>
        /// <returns></returns>
        private IQueryable<Sys_WorkFlowTable> GetAuditQuery(IQueryable<Sys_WorkFlowTable> queryable, bool all = false)
        {
            var user = UserContext.Current.UserInfo;
            var deptIds = user.DeptIds.Select(s => s.ToString());
            var stepQuery = _stepRepository.FindAsIQueryable(x => ((x.StepType == (int)AuditType.用户审批 && x.StepValue == user.User_Id.ToString())
              || (x.StepType == (int)AuditType.角色审批 && user.RoleIds.Select(s => s.ToString()).Contains(x.StepValue))
              || (x.StepType == (int)AuditType.部门审批 && deptIds.Contains(x.StepValue)))
               );
            //显示当前用户的全部数据
            if (all)
            {
                queryable = queryable.Where(x => stepQuery.Any(c => x.WorkFlowTable_Id == c.WorkFlowTable_Id && (x.CreateID == user.User_Id || x.CurrentStepId == c.StepId || c.AuditId == user.User_Id)));
                return queryable;
            }
            queryable = queryable.Where(x => stepQuery.Any(c => x.WorkFlowTable_Id == c.WorkFlowTable_Id
            && x.CurrentStepId == c.StepId && (c.AuditStatus == null || c.AuditStatus == 0))
                                     && (x.AuditStatus == (int)AuditStatus.待审核 || x.AuditStatus == (int)AuditStatus.审核中));
            return queryable;
        }
        public override PageGridData<Sys_WorkFlowTable> GetPageData(PageDataOptions options)
        {
            this.IsMultiTenancy = false;
            var user = UserContext.Current.UserInfo;
           
            //pc端
            //显示当前用户需要审批的数据
            QueryRelativeExpression = (IQueryable<Sys_WorkFlowTable> queryable) =>
            {
                int value = options.Value.GetInt();
                switch (value)
                {
                    //我的提交
                    case 50:
                        queryable = queryable.Where(x => x.CreateID == UserContext.Current.UserId);
                        break;
                    //我的审核
                    case 40:
                        var stepQuery = _stepRepository.FindAsIQueryable(c => c.AuditId == user.User_Id);
                        queryable = queryable.Where(x => stepQuery.Any(c => x.WorkFlowTable_Id == c.WorkFlowTable_Id));
                        break;
                    case (int)AuditStatus.待审核:
                    case (int)AuditStatus.审核中:
                        queryable = GetAuditQuery(queryable);
                        break;
                    case (int)AuditStatus.审核通过:
                    case (int)AuditStatus.审核未通过:
                    case (int)AuditStatus.驳回:
                        var _stepQuery = _stepRepository.FindAsIQueryable(x => x.AuditId == user.User_Id);
                        queryable = queryable.Where(x => _stepQuery.Any(c => x.WorkFlowTable_Id == c.WorkFlowTable_Id));
                        if (value == (int)AuditStatus.审核通过)
                        {
                            queryable = queryable.Where(x => x.AuditStatus == (int)AuditStatus.审核通过);
                        }
                        else if (value == (int)AuditStatus.审核未通过)
                        {
                            queryable = queryable.Where(x => x.AuditStatus == (int)AuditStatus.审核未通过);
                        }
                        else
                        {
                            queryable = queryable.Where(x => x.AuditStatus == (int)AuditStatus.驳回);
                        }
                        break;
                    default:
                        break;
                }
                queryable = queryable.Where(x => (x.AuditStatus != (int)AuditStatus.草稿 && x.AuditStatus != (int)AuditStatus.待提交));
                if (value == -1 && !UserContext.Current.IsSuperAdmin)
                {
                    queryable = GetAuditQuery(queryable, true);
                }
                return queryable;
            };

            return base.GetPageData(options);
        }
    }
}
