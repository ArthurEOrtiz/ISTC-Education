using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace istc_education_api.Migrations
{
    /// <inheritdoc />
    public partial class Add_Certification_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Certifications",
                columns: table => new
                {
                    CertificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CertificationType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certifications", x => x.CertificationId);
                    table.ForeignKey(
                        name: "FK_Certifications_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_StudentId",
                table: "Certifications",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certifications");
        }
    }
}
