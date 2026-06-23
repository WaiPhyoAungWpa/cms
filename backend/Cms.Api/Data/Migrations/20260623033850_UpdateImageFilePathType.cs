using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cms.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateImageFilePathType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 1,
                column: "FilePath",
                value: "/images/defaults/experience-1.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 2,
                column: "FilePath",
                value: "/images/defaults/experience-2.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 3,
                column: "FilePath",
                value: "/images/defaults/experience-3.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 4,
                column: "FilePath",
                value: "/images/defaults/learning-1.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 5,
                column: "FilePath",
                value: "/images/defaults/learning-2.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 6,
                column: "FilePath",
                value: "/images/defaults/learning-3.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 7,
                column: "FilePath",
                value: "/images/defaults/lifestyle-1.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 8,
                column: "FilePath",
                value: "/images/defaults/lifestyle-2.png");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 9,
                column: "FilePath",
                value: "/images/defaults/lifestyle-3.png");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 1,
                column: "FilePath",
                value: "/images/defaults/experience-1.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 2,
                column: "FilePath",
                value: "/images/defaults/experience-2.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 3,
                column: "FilePath",
                value: "/images/defaults/experience-3.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 4,
                column: "FilePath",
                value: "/images/defaults/learning-1.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 5,
                column: "FilePath",
                value: "/images/defaults/learning-2.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 6,
                column: "FilePath",
                value: "/images/defaults/learning-3.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 7,
                column: "FilePath",
                value: "/images/defaults/lifestyle-1.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 8,
                column: "FilePath",
                value: "/images/defaults/lifestyle-2.jpg");

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: 9,
                column: "FilePath",
                value: "/images/defaults/lifestyle-3.jpg");
        }
    }
}
