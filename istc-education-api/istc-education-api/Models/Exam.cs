using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Exam
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int ExamId { get; set; }

		[ForeignKey("Student")]
		public int StudentId { get; set; }

		[ForeignKey("Course")]
		public int CourseId { get; set; }

		public int ExamCredit { get; set; }	

		public bool HasPassed { get; set; } = false;
	}
}
