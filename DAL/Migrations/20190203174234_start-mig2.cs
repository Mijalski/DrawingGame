using Microsoft.EntityFrameworkCore.Migrations;

namespace DAL.Migrations
{
    public partial class startmig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameEnabled",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GameEnabled",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);
        }
    }
}
