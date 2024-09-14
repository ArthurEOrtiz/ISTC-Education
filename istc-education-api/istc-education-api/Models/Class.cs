using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Class
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int ClassId { get; set; }

		[ForeignKey("Course")]
		public int CourseId { get; set; }

		public DateOnly Date { get; set; }

		public TimeOnly Start { get; set; }

		public TimeOnly End { get; set;  }

		public virtual HashSet<Attendance>? Attendances { get; set; } = [];
	}
}
