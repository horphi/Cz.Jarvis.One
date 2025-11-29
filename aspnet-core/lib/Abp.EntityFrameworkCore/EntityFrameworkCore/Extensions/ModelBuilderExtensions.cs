using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace Abp.EntityFrameworkCore.Extensions;

public static class ModelBuilderExtensions
{
    public static ModelBuilder ConfigureSoftDeleteDbFunction(this ModelBuilder modelBuilder, MethodInfo methodInfo, AbpEfCoreCurrentDbContext abpEfCoreCurrentDbContext)
    {
        modelBuilder.HasDbFunction(methodInfo)
            .HasTranslation(args =>
            {
                // (bool isDeleted, bool boolParam)
                var isDeleted = args[0];
                var boolParam = args[1];

                if (abpEfCoreCurrentDbContext.Context?.IsSoftDeleteFilterEnabled == true)
                {
                    // IsDeleted == false
                    return new SqlBinaryExpression(
                        ExpressionType.Equal,
                        isDeleted,
                        new SqlConstantExpression(Expression.Constant(false), boolParam.TypeMapping),
                        boolParam.Type,
                        boolParam.TypeMapping);
                }

                // empty where sql
                return new SqlConstantExpression(Expression.Constant(true), boolParam.TypeMapping);
            });

        return modelBuilder;
    }

    public static ModelBuilder ConfigureMayHaveTenantDbFunction(this ModelBuilder modelBuilder, MethodInfo methodInfo, AbpEfCoreCurrentDbContext abpEfCoreCurrentDbContext)
    {
        modelBuilder.HasDbFunction(methodInfo)
            .HasTranslation(args =>
            {
                // Multi-tenancy removed - always return true (no filtering)
                var boolParam = args[2];
                return new SqlConstantExpression(Expression.Constant(true), boolParam.TypeMapping);
            });

        return modelBuilder;
    }

    public static ModelBuilder ConfigureMustHaveTenantDbFunction(this ModelBuilder modelBuilder, MethodInfo methodInfo, AbpEfCoreCurrentDbContext abpEfCoreCurrentDbContext)
    {
        modelBuilder.HasDbFunction(methodInfo)
            .HasTranslation(args =>
            {
                // Multi-tenancy removed - always return true (no filtering)
                var boolParam = args[2];
                return new SqlConstantExpression(Expression.Constant(true), boolParam.TypeMapping);
            });

        return modelBuilder;
    }
}