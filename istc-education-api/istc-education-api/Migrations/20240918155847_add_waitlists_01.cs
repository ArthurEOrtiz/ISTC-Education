using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace istc_education_api.Migrations
{
    /// <inheritdoc />
    public partial class add_waitlists_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WaitList_Courses_CourseId",
                table: "WaitList");

            migrationBuilder.DropForeignKey(
                name: "FK_WaitList_Students_StudentId",
                table: "WaitList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WaitList",
                table: "WaitList");

            migrationBuilder.RenameTable(
                name: "WaitList",
                newName: "WaitLists");

            migrationBuilder.RenameIndex(
                name: "IX_WaitList_StudentId",
                table: "WaitLists",
                newName: "IX_WaitLists_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_WaitList_CourseId",
                table: "WaitLists",
                newName: "IX_WaitLists_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WaitLists",
                table: "WaitLists",
                column: "WaitListId");

            migrationBuilder.AddForeignKey(
                name: "FK_WaitLists_Courses_CourseId",
                table: "WaitLists",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WaitLists_Students_StudentId",
                table: "WaitLists",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WaitLists_Courses_CourseId",
                table: "WaitLists");

            migrationBuilder.DropForeignKey(
                name: "FK_WaitLists_Students_StudentId",
                table: "WaitLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WaitLists",
                table: "WaitLists");

            migrationBuilder.RenameTable(
                name: "WaitLists",
                newName: "WaitList");

            migrationBuilder.RenameIndex(
                name: "IX_WaitLists_StudentId",
                table: "WaitList",
                newName: "IX_WaitList_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_WaitLists_CourseId",
                table: "WaitList",
                newName: "IX_WaitList_CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WaitList",
                table: "WaitList",
                column: "WaitListId");

            migrationBuilder.AddForeignKey(
                name: "FK_WaitList_Courses_CourseId",
                table: "WaitList",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WaitList_Students_StudentId",
                table: "WaitList",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
