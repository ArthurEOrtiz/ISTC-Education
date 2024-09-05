using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Student
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int StudentId { get; set; }

		[ForeignKey("User")]
		public int UserId { get; set; }

		public bool AppraiserCertified { get; set; } = false;

		public bool MappingCertified { get; set; } = false;

		public virtual HashSet<Certification>? Certifications { get; set; } = [];

		public virtual HashSet<Attendance>? Attendances { get; set; } = [];

		public virtual HashSet<Exam>? Exams { get; set; } = [];

		public virtual HashSet<WaitList>? WaitLists { get; set; } = [];
	}
}
