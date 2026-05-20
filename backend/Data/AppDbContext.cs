using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RandevuTakip.Models;

namespace RandevuTakip.Data
{
    public class AppDbContext: IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) { }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Place> Places { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Birden fazla silme yolu (cascade path) hatasını önlemek için
            // User silindiğinde randevuların silinmesini kısıtlıyoruz (Place üzerinden silinecekler)
            builder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Rating sütununun tipini açıkça belirtmek (isteğe bağlı ama iyi uygulama)
            builder.Entity<Place>()
                .Property(p => p.Rating)
                .HasColumnType("float");
        }
    }
}
