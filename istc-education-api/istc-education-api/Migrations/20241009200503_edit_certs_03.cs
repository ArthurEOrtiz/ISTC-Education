using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace istc_education_api.Migrations
{
    /// <inheritdoc />
    public partial class edit_certs_03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CertificationType",
                table: "Certifications",
                newName: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Certifications",
                newName: "CertificationType");
        }
    }
}
