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
                new Answer {Text = "Spodenki do ćpania", IsAppropriate = true, Id = 4},
                new Answer {Text = "Pokaz tanców ognia", IsAppropriate = true, Id = 5},
                new Answer {Text = "Chleb z cukrem", IsAppropriate = true, Id = 6},
                new Answer {Text = "Ananas na pizzy", IsAppropriate = true, Id = 7},
                new Answer {Text = "Ruch antyszczepionkowców", IsAppropriate = true, Id = 8},
                new Answer {Text = "Hakuje mainframe", IsAppropriate = true, Id = 9},
                new Answer {Text = "Kopsnij ino piątaka ksieciuniu", IsAppropriate = true, Id = 10},
                new Answer {Text = "Gdzie jest nemo?", IsAppropriate = true, Id = 11},
                new Answer {Text = "Żelatyna", IsAppropriate = true, Id = 12});
        }

        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomConnection> RoomConnections { get; set; }
        public DbSet<Answer> Answers { get; set; }
        
    }
}
