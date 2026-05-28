using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuestPocBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddDeprecatedAtToLabOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeprecatedAt",
                table: "LabOrders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "LabOrders",
                keyColumn: "Id",
                keyValue: 1,
                column: "DeprecatedAt",
                value: null);

            migrationBuilder.UpdateData(
                table: "LabOrders",
                keyColumn: "Id",
                keyValue: 2,
                column: "DeprecatedAt",
                value: null);

            migrationBuilder.UpdateData(
                table: "LabOrders",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeprecatedAt",
                value: null);

            migrationBuilder.UpdateData(
                table: "LabOrders",
                keyColumn: "Id",
                keyValue: 4,
                column: "DeprecatedAt",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeprecatedAt",
                table: "LabOrders");
        }
    }
}
