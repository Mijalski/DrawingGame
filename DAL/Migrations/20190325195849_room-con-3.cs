using Microsoft.EntityFrameworkCore.Migrations;

namespace DAL.Migrations
{
    public partial class roomcon3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlayerCount",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "KeyCode",
                table: "RoomConnections");

            migrationBuilder.RenameColumn(
                name: "isMaster",
                table: "RoomConnections",
                newName: "IsMaster");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "RoomConnections",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_RoomConnections_RoomId",
                table: "RoomConnections",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomConnections_Rooms_RoomId",
                table: "RoomConnections",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomConnections_Rooms_RoomId",
                table: "RoomConnections");

            migrationBuilder.DropIndex(
                name: "IX_RoomConnections_RoomId",
                table: "RoomConnections");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "RoomConnections");

            migrationBuilder.RenameColumn(
                name: "IsMaster",
                table: "RoomConnections",
                newName: "isMaster");

            migrationBuilder.AddColumn<int>(
                name: "PlayerCount",
                table: "Rooms",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "KeyCode",
                table: "RoomConnections",
                nullable: false,
                defaultValue: "");
        }
    }
}
