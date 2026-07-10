using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cms.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueAdminUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Admins_Username",
                table: "Admins",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Admins_Username",
                table: "Admins");
        }
    }
}
