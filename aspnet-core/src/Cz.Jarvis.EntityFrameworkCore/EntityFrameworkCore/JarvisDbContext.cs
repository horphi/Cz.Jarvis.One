using System.Collections.Generic;
using System.Text.Json;
using Abp.OpenIddict.Applications;
using Abp.OpenIddict.Authorizations;
using Abp.OpenIddict.EntityFrameworkCore;
using Abp.OpenIddict.Scopes;
using Abp.OpenIddict.Tokens;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cz.Jarvis.Authorization.Delegation;
using Cz.Jarvis.Authorization.Roles;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Chat;
using Cz.Jarvis.ExtraProperties;
using Cz.Jarvis.Friendships;
using Cz.Jarvis.Storage;

namespace Cz.Jarvis.EntityFrameworkCore
{
    public class JarvisDbContext : AbpZeroDbContext<Role, User, JarvisDbContext>, IOpenIddictDbContext
    {
        /* Define an IDbSet for each entity of the application */

        public virtual DbSet<OpenIddictApplication> Applications { get; }
        
        public virtual DbSet<OpenIddictAuthorization> Authorizations { get; }
        
        public virtual DbSet<OpenIddictScope> Scopes { get; }
        
        public virtual DbSet<OpenIddictToken> Tokens { get; }
        
        public virtual DbSet<BinaryObject> BinaryObjects { get; set; }

        public virtual DbSet<Friendship> Friendships { get; set; }

        public virtual DbSet<ChatMessage> ChatMessages { get; set; }

        public virtual DbSet<UserDelegation> UserDelegations { get; set; }

        public virtual DbSet<RecentPassword> RecentPasswords { get; set; }

        public JarvisDbContext(DbContextOptions<JarvisDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChatMessage>(b =>
            {
                b.HasIndex(e => new { e.UserId, e.ReadState });
                b.HasIndex(e => new { e.TargetUserId, e.ReadState });
            });

            modelBuilder.Entity<Friendship>(b =>
            {
                b.HasIndex(e => new { e.UserId });
                b.HasIndex(e => new { e.FriendUserId });
            });

            modelBuilder.Entity<UserDelegation>(b =>
            {
                b.HasIndex(e => new { e.SourceUserId });
                b.HasIndex(e => new { e.TargetUserId });
            });
            
            modelBuilder.ConfigureOpenIddict();
        }
    }
}