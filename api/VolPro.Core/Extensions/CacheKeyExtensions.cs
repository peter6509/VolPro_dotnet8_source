﻿using VolPro.Core.Enums;
using System;

namespace VolPro.Core.Extensions
{
    public static class CacheKeyExtensions
    {
        public static string GetKey(this CPrefix prefix, object value)
        {
            return prefix.ToString() + value;
        }

        public static string GetUserIdKey(this int userId)
        {
            return CPrefix.UID.ToString() + userId;
        }

        public static string GetRoleIdKey(this int roleId)
        {
            return CPrefix.Role.ToString() + roleId;
        }
    }
}
