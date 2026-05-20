using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RandevuTakip.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentPlaceRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlaceId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Places",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Places", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PlaceId",
                table: "Appointments",
                column: "PlaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Places_PlaceId",
                table: "Appointments",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Places_PlaceId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "Places");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_PlaceId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PlaceId",
                table: "Appointments");
        }
    }
}
