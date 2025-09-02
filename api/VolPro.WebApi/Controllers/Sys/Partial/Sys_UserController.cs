﻿
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VolPro.Core;
using VolPro.Core.CacheManager;
using VolPro.Core.Configuration;
using VolPro.Core.Controllers.Basic;
using VolPro.Core.DBManager;
using VolPro.Core.EFDbContext;
using VolPro.Core.Enums;
using VolPro.Core.Extensions;
using VolPro.Core.Filters;
using VolPro.Core.Infrastructure;
using VolPro.Core.ManageUser;
using VolPro.Core.ObjectActionValidator;
using VolPro.Core.Services;
using VolPro.Core.Utilities;
using VolPro.Entity.AttributeManager;
using VolPro.Entity.DomainModels;
using VolPro.Sys.IRepositories;
using VolPro.Sys.IServices;
using VolPro.Sys.Repositories;
using VolPro.WebApi.Controllers.Hubs;

namespace VolPro.Sys.Controllers
{
    [Route("api/User")]
    public partial class Sys_UserController
    {
        private ISys_UserRepository _userRepository;
        private ICacheService _cache;
        [ActivatorUtilitiesConstructor]
        public Sys_UserController(ISys_UserService userService, ISys_UserRepository userRepository, ICacheService cahce)
          : base(userService)
        {
            _cache = cahce;
            _userRepository = userRepository;
        }

        [HttpPost, HttpGet, Route("login"), AllowAnonymous]
        [ObjectModelValidatorFilter(ValidatorModel.Login)]
        public async Task<IActionResult> Login([FromBody] LoginInfo loginInfo)
        {
            return Json(await Service.Login(loginInfo));
        }

        private readonly ConcurrentDictionary<int, object> _lockCurrent = new ConcurrentDictionary<int, object>();
        [HttpPost, Route("replaceToken")]
        public IActionResult ReplaceToken()
        {
            WebResponseContent responseContent = new WebResponseContent();
            string error = "";
            string key = $"rp:Token:{UserContext.Current.UserId}";
            UserInfo userInfo = null;
            try
            {
                //如果5秒内替换过token,直接使用最新的token(防止一个页面多个并发请求同时替换token导致token错位)
                if (_cache.Exists(key))
                {
                    return Json(responseContent.OK(null, _cache.Get(key)));
                }
                var _obj = _lockCurrent.GetOrAdd(UserContext.Current.UserId, new object() { });
                lock (_obj)
                {
                    if (_cache.Exists(key))
                    {
                        return Json(responseContent.OK(null, _cache.Get(key)));
                    }
                    string requestToken = HttpContext.Request.Headers[AppSetting.TokenHeaderName];
                    requestToken = requestToken?.Replace("Bearer ", "");

                    if (JwtHelper.IsExp(requestToken)) return Json(responseContent.Error("Token已过期!"));

                    int userId = UserContext.Current.UserId;

                    userInfo = _userRepository.FindAsIQueryable(x => x.User_Id == userId).Select(
                             s => new UserInfo()
                             {
                                 User_Id = userId,
                                 UserName = s.UserName,
                                 UserTrueName = s.UserTrueName,
                                 Role_Id = s.Role_Id ?? 0,
                                 //   RoleName = s.RoleName
                             }).FirstOrDefault();

                    if (userInfo == null) return Json(responseContent.Error("未查到用户信息!"));
                    int expir = UserContext.MenuType == 1 ? 43200 : AppSetting.ExpMinutes;
                    string token = JwtHelper.IssueJwt(userInfo, expir);
                    //移除当前缓存
                    _cache.Remove(userId.GetUserIdKey());
                    //只更新的token字段
                    _userRepository.Update(new Sys_User() { User_Id = userId, Token = token }, x => x.Token, true);
                    //添加一个5秒缓存
                    _cache.Add(key, token, 5);

                    string accessToken = null;
                    if (AppSetting.FileAuth)
                    {
                        expir = expir + 30;
                        string dt = DateTime.Now.AddMinutes(expir).ToString("yyyy-MM-dd HH:mm");
                        accessToken = $"{userId}_{dt}".EncryptDES(AppSetting.Secret.User);
                        _cache.Add(accessToken, dt, expir);
                        responseContent.OK(null, new { accessToken, token });
                    }
                    else
                    {
                        responseContent.OK(null, token);
                    }
                }
            }
            catch (Exception ex)
            {
                error = ex.Message + ex.StackTrace;
                responseContent.Error("token替换异常");
            }
            finally
            {
                _lockCurrent.TryRemove(UserContext.Current.UserId, out object val);
                string _message = $"用户{userInfo?.User_Id}_{userInfo?.UserTrueName},({(responseContent.Status ? "token替换成功" : "token替换失败")})";
                Logger.Info(LoggerType.ReplaceToeken, _message, null, error);
            }
            return Json(responseContent);
        }


        [HttpPost, Route("modifyPwd")]
        [ApiActionPermission]
        public async Task<IActionResult> ModifyPwd([FromBody] Dictionary<string, string> info)
        {
            return Json(await Service.ModifyPwd(info?["oldPwd"], info?["newPwd"]));
        }

        [HttpPost, Route("getCurrentUserInfo")]
        public async Task<IActionResult> GetCurrentUserInfo()
        {
            return Json(await Service.GetCurrentUserInfo());
        }

        //只能超级管理员才能修改密码
        //2020.08.01增加修改密码功能
        //[HttpPost, Route("modifyUserPwd"), ApiActionPermission(ActionRolePermission.SuperAdmin)]
        [HttpPost, Route("modifyUserPwd"), ApiActionPermission(ActionPermissionOptions.Add | ActionPermissionOptions.Update)]
        public IActionResult ModifyUserPwd([FromBody] LoginInfo loginInfo)
        {
            string userName = loginInfo?.UserName;
            string password = loginInfo?.Password;
            WebResponseContent webResponse = new WebResponseContent();
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(userName))
            {
                return Json(webResponse.Error("参数不完整"));
            }
            if (password.Length < 6) return Json(webResponse.Error("密码长度不能少于6位"));
            Sys_User user = _userRepository.FindFirst(x => x.UserName == userName);
            if (user == null)
            {
                return Json(webResponse.Error("用户不存在".Translator()));
            }
            user.UserPwd = password.EncryptDES(AppSetting.Secret.User);
            _userRepository.Update(user, x => new { x.UserPwd }, true);
            //如果用户在线，强制下线
            UserContext.Current.LogOut(user.User_Id);
            return Json(webResponse.OK("密码修改成功"));
        }

        /// <summary>
        /// 2020.06.15增加登陆验证码
        /// </summary>
        /// <returns></returns>
        [HttpGet, Route("getVierificationCode"), AllowAnonymous]
        public IActionResult GetVierificationCode()
        {
            string code = VierificationCode.RandomText();
            var data = new
            {
                img = VierificationCode.CreateBase64Imgage(code),
                uuid = Guid.NewGuid()
            };
            HttpContext.GetService<IMemoryCache>().Set(data.uuid.ToString(), code, new TimeSpan(0, 5, 0));
            return Json(data);
        }
        [ApiActionPermission()]
        public override IActionResult Upload(IEnumerable<IFormFile> fileInput)
        {
            return base.Upload(fileInput);
        }
        [HttpPost, Route("updateUserInfo")]
        public IActionResult UpdateUserInfo([FromBody] Sys_User user)
        {
            user.User_Id = UserContext.Current.UserId;

            _userRepository.Update(user, x => new { x.UserTrueName, x.Gender, x.Remark, x.HeadImageUrl }, true);
            return Content("修改成功");
        }

        public override ActionResult GetPageData([FromBody] PageDataOptions loadData)
        {
            PageGridData<Sys_User> gridData = Service.GetPageData(loadData);
            //是否使用用户数据权限
            gridData.extra = AppSetting.UserAuth;
            //设置用户是否在线
            foreach (var item in gridData.rows)
            {
                item.IsOnline = UserCache.GetOnline(item.UserName);
            }
            return JsonNormal(gridData);
        }
        [HttpPost, Route("getUserAuth"), ApiActionPermission(ActionPermissionOptions.Add | ActionPermissionOptions.Update)]
        public async Task<IActionResult> GetUserAuth(int userId)
        {
            var data = await _userRepository.DbContext.Set<Sys_UserAuth>().Where(x => x.UserId == userId && x.AuthUserIds != "")
                 .Select(s => new { id = s.MenuId, userIds = s.AuthUserIds })
                 .ToListAsync();

            var userIds = data.Select(s => s.userIds.Split(",")).SelectMany(x => x).Select(s => s.GetInt()).Distinct();

            var users = await _userRepository.FindAsIQueryable(x => userIds.Contains(x.User_Id))
                  .Select(s => new { userId = s.User_Id, userName = s.UserTrueName })
                  .ToListAsync();

            return Json(new { data, users });
        }

        [HttpPost, Route("saveUserAuth"), ApiActionPermission(ActionPermissionOptions.Add | ActionPermissionOptions.Update)]
        public async Task<IActionResult> SaveUserAuth([FromBody] List<Sys_UserAuth> userAuths, int userId)
        {
            if (userAuths == null || userId < 0)
            {
                return Content("参数不完整");
            }
            var query = _userRepository.DbContext.Set<Sys_UserAuth>();
            var data = await query.Where(x => x.UserId == userId).ToListAsync();

            List<Sys_UserAuth> add = new List<Sys_UserAuth>();
            List<Sys_UserAuth> update = new List<Sys_UserAuth>();

            foreach (var item in userAuths)
            {
                var auth = data.Where(x => item.MenuId == x.MenuId).FirstOrDefault();
                if (auth == null)
                {
                    if (!string.IsNullOrEmpty(item.AuthUserIds))
                    {
                        item.UserId = userId;
                        add.Add(item);
                    }
                }
                else
                {
                    item.Id = auth.Id;
                    update.Add(item);
                }
            }
            _userRepository.AddRange(add);
            _userRepository.UpdateRange(update, x => new { x.AuthUserIds }, true);

            UserContext.Current.RemoveUserAuthData(userId);
            return Content("保存成功");
        }
    }
}
