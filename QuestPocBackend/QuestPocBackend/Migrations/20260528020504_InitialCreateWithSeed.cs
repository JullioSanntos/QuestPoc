using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QuestPocBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LabOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TestName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabOrders", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "LabOrders",
                columns: new[] { "Id", "PatientId", "Status", "TestName" },
                values: new object[,]
                {
                    { 1, "PT-8842", "Completed", "Comprehensive Metabolic Panel" },
                    { 2, "PT-1094", "In Progress", "Lipid Panel with Reflex" },
                    { 3, "PT-3321", "Pending", "Hemoglobin A1c" },
                    { 4, "PT-5541", "Completed", "Vitamin D, 25-Hydroxy" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LabOrders");
        }
    }
}
