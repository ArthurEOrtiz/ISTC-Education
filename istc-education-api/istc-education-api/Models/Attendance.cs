using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Attendance
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int AttendanceId { get; set; }

		[ForeignKey("Student")]
		public int StudentId { get; set; }

		[ForeignKey("Class")]
		public int ClassId { get; set; }

		public bool HasAttended { get; set; }
	}
}
