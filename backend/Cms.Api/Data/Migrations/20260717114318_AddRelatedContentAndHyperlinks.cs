using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Cms.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRelatedContentAndHyperlinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HyperlinkName",
                table: "Sections",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HyperlinkUrl",
                table: "Sections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HyperlinkName",
                table: "Contents",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HyperlinkUrl",
                table: "Contents",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContentRelationships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ContentId = table.Column<int>(type: "integer", nullable: false),
                    RelatedContentId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentRelationships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContentRelationships_Contents_ContentId",
                        column: x => x.ContentId,
                        principalTable: "Contents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContentRelationships_Contents_RelatedContentId",
                        column: x => x.RelatedContentId,
                        principalTable: "Contents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentRelationships_ContentId_RelatedContentId",
                table: "ContentRelationships",
                columns: new[] { "ContentId", "RelatedContentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContentRelationships_RelatedContentId",
                table: "ContentRelationships",
                column: "RelatedContentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContentRelationships");

            migrationBuilder.DropColumn(
                name: "HyperlinkName",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "HyperlinkUrl",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "HyperlinkName",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "HyperlinkUrl",
                table: "Contents");
        }
    }
}
