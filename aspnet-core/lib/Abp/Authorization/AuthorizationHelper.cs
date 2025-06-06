﻿using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using System.Linq;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Localization;
using Abp.Reflection;
using Abp.Runtime.Session;

namespace Abp.Authorization
{
    public class AuthorizationHelper : IAuthorizationHelper, ITransientDependency
    {
        public IAbpSession AbpSession { get; set; }
        public IPermissionChecker PermissionChecker { get; set; }
        public ILocalizationManager LocalizationManager { get; set; }

        private readonly IAuthorizationConfiguration _authConfiguration;

        public AuthorizationHelper(IAuthorizationConfiguration authConfiguration)
        {
            _authConfiguration = authConfiguration;
            AbpSession = NullAbpSession.Instance;
            PermissionChecker = NullPermissionChecker.Instance;
            LocalizationManager = NullLocalizationManager.Instance;
        }

        public virtual async Task AuthorizeAsync(IEnumerable<IAbpAuthorizeAttribute> authorizeAttributes)
        {
            if (!_authConfiguration.IsEnabled)
            {
                return;
            }

            if (!AbpSession.UserId.HasValue)
            {
                throw new AbpAuthorizationException(
                    LocalizationManager.GetString(AbpConsts.LocalizationSourceName, "CurrentUserDidNotLoginToTheApplication")
                    );
            }

            foreach (var authorizeAttribute in authorizeAttributes)
            {
                await PermissionChecker.AuthorizeAsync(authorizeAttribute.RequireAllPermissions, authorizeAttribute.Permissions);
            }
        }

        public virtual void Authorize(IEnumerable<IAbpAuthorizeAttribute> authorizeAttributes)
        {
            if (!_authConfiguration.IsEnabled)
            {
                return;
            }

            if (!AbpSession.UserId.HasValue)
            {
                throw new AbpAuthorizationException(
                    LocalizationManager.GetString(AbpConsts.LocalizationSourceName, "CurrentUserDidNotLoginToTheApplication")
                    );
            }

            foreach (var authorizeAttribute in authorizeAttributes)
            {
                PermissionChecker.Authorize(authorizeAttribute.RequireAllPermissions, authorizeAttribute.Permissions);
            }
        }

        public virtual async Task AuthorizeAsync(MethodInfo methodInfo, Type type)
        {
            await CheckPermissionsAsync(methodInfo, type);
        }

        public virtual void Authorize(MethodInfo methodInfo, Type type)
        {
            CheckPermissions(methodInfo, type);
        }

        protected virtual async Task CheckPermissionsAsync(MethodInfo methodInfo, Type type)
        {
            if (!_authConfiguration.IsEnabled)
            {
                return;
            }

            if (AllowAnonymous(methodInfo, type))
            {
                return;
            }

            if (ReflectionHelper.IsPropertyGetterSetterMethod(methodInfo, type))
            {
                return;
            }

            if (!methodInfo.IsPublic && !methodInfo.GetCustomAttributes().OfType<IAbpAuthorizeAttribute>().Any())
            {
                return;
            }

            var authorizeAttributes =
                ReflectionHelper
                    .GetAttributesOfMemberAndType(methodInfo, type)
                    .OfType<IAbpAuthorizeAttribute>()
                    .ToArray();

            if (!authorizeAttributes.Any())
            {
                return;
            }

            await AuthorizeAsync(authorizeAttributes);
        }

        protected virtual void CheckPermissions(MethodInfo methodInfo, Type type)
        {
            if (!_authConfiguration.IsEnabled)
            {
                return;
            }

            if (AllowAnonymous(methodInfo, type))
            {
                return;
            }

            if (ReflectionHelper.IsPropertyGetterSetterMethod(methodInfo, type))
            {
                return;
            }

            if (!methodInfo.IsPublic && !methodInfo.GetCustomAttributes().OfType<IAbpAuthorizeAttribute>().Any())
            {
                return;
            }

            var authorizeAttributes =
                ReflectionHelper
                    .GetAttributesOfMemberAndType(methodInfo, type)
                    .OfType<IAbpAuthorizeAttribute>()
                    .ToArray();

            if (!authorizeAttributes.Any())
            {
                return;
            }

            Authorize(authorizeAttributes);
        }

        private static bool AllowAnonymous(MemberInfo memberInfo, Type type)
        {
            return ReflectionHelper
                .GetAttributesOfMemberAndType(memberInfo, type)
                .OfType<IAbpAllowAnonymousAttribute>()
                .Any();
        }
    }
}