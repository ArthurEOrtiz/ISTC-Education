using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace istc_education_api.Migrations
{
    /// <inheritdoc />
    public partial class Add_User_Fields_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "Contacts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "Contacts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Contacts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Contacts",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Contacts",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Contacts");
        }
    }
}
