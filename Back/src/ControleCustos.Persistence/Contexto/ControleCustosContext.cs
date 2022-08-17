using ControleCustos.Domain;
using ControleCustos.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ControleCustos.Persistence.Contexto
{
    public class
    ControleCustosContext
    :
    IdentityDbContext<User,
        Role,
        int,
        IdentityUserClaim<int>,
        UserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>
    >
    {
        public ControleCustosContext(
            DbContextOptions<ControleCustosContext> options
        ) :
            base(options)
        {
        }

        public DbSet<Conta> Conta { get; set; }

        public DbSet<Fornecedor> Fornecedor { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<UserRole>(userRole =>
                {
                    userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
                    userRole
                        .HasOne(ur => ur.Role)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();

                    userRole
                        .HasOne(ur => ur.User)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();
                });

             modelBuilder
                .Entity<Conta>()
                .HasKey(CO => new { CO.ContaId, CO.FornecedorId });

             modelBuilder
                .Entity<Fornecedor>()
                .HasMany(e => e.Contas)
                .WithOne(rs => rs.Fornecedor);
        }
    }
}
