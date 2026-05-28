using Microsoft.EntityFrameworkCore;
using QuestPocBackend.Controllers;

namespace QuestPocBackend.Data;

public class AppDbContext : DbContext {
#pragma warning disable IDE0290
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
#pragma warning restore IDE0290
    }

    public DbSet<LabOrder> LabOrders { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // Seed initial data directly into the database schema blueprint
        modelBuilder.Entity<LabOrder>().HasData(
            new LabOrder { Id = 1, TestName = "Comprehensive Metabolic Panel", PatientId = "PT-8842", Status = "Completed" },
            new LabOrder { Id = 2, TestName = "Lipid Panel with Reflex", PatientId = "PT-1094", Status = "In Progress" },
            new LabOrder { Id = 3, TestName = "Hemoglobin A1c", PatientId = "PT-3321", Status = "Pending" },
            new LabOrder { Id = 4, TestName = "Vitamin D, 25-Hydroxy", PatientId = "PT-5541", Status = "Completed" }
        );
    }
}