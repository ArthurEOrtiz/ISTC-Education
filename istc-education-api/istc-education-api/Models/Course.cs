using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Course
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CourseId { get; set; }

		[RegularExpression("UpComing|InProgress|Archived", 
			ErrorMessage = "Status must be 'UpComing''InProgress' or 'Archived'.")]
		public string Status { get; set; } = "UpComing";

		[Required(ErrorMessage = "Title is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 50 characters.")]
		public string Title { get; set; } = string.Empty;

		[StringLength(500, ErrorMessage = "Description must be between 0 and 500 characters.")]
		public string? Description { get; set; }

		public int AttendanceCredit { get; set; }

		public int MaxAttendance { get; set; } 

		public DateTime EnrollmentDeadline { get; set; }

		[Required(ErrorMessage = "Instructor Name is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Instructor name must be between 3 and 50 characters.")]
		public string InstructorName { get; set; } = string.Empty;

		[EmailAddress]
		public string? InstructorEmail { get; set; }

		public bool HasExam { get; set; }

		public int? ExamCredit { get; set; }	

		public bool HasPDF { get; set; }

		public virtual Location? Location { get; set; } = new Location();

		public virtual PDF? PDF { get; set; } = new PDF();

		public virtual HashSet<Topic>? Topics { get; set; } = [];	

		public virtual HashSet<Exam>? Exams { get; set; } = [];

		public virtual HashSet<Class>? Classes { get; set; } = [];

		public virtual HashSet<WaitList>? WaitList { get; set; } = [];
	}
}
