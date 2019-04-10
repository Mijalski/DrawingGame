using System;
using DAL.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
    public class DatabaseContext : IdentityDbContext<UserAccount>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Answer>().HasData(
                new Answer {Text = "Krowa dająca mleko", IsAppropriate = true, Id = 1},
                new Answer {Text = "Jeżyk w lesie", IsAppropriate = true, Id = 2},
                new Answer {Text = "Blender i coś obok", IsAppropriate = true, Id = 3},
                new Answer {Text = "Spodenki do ćpania", IsAppropriate = true, Id = 4});
        }

        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomConnection> RoomConnections { get; set; }
        public DbSet<Answer> Answers { get; set; }
        
    }
}
