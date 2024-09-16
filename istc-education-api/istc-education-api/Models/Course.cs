using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Course
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CourseId { get; set; }

		[Required(ErrorMessage = "Status is required.")]
		[EnumDataType(typeof(CourseStatus), ErrorMessage ="Status must be 'UpComing', 'InProgress', 'Completed', 'Cancelled', or 'Archived'.")]
		public CourseStatus Status { get; set; } = CourseStatus.UpComing;

		[Required(ErrorMessage = "Title is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 50 characters.")]
		public string Title { get; set; } = string.Empty;

		[StringLength(500, ErrorMessage = "Description must be between 0 and 500 characters.")]
		public string? Description { get; set; }

		public int AttendanceCredit { get; set; }

		public int MaxAttendance { get; set; } 

		public DateOnly EnrollmentDeadline { get; set; }

		[Required(ErrorMessage = "Instructor Name is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Instructor name must be between 3 and 50 characters.")]
		public string InstructorName { get; set; } = string.Empty;

		[EmailAddress]
		public string? InstructorEmail { get; set; }

		public bool HasExam { get; set; }

		public int? ExamCredit { get; set; }	

		public bool HasPDF { get; set; }

		// So every course needs a location, even if its online. 
		// I'm telling the computer to make one even if its blank.
		public virtual Location Location { get; set; } = new Location();

		// Storing pdf's in a blob as a hack for now.
		// I'm gonna bring this up to supervision we need something better.
		public virtual PDF? PDF { get; set; }

		// This is the one many-to-many relationship in the database.
		// I'm using a HashSet because it's a collection of unique items.
		// I'm using a nullable type because it's possible for a course to have no topics.
		public virtual ICollection<Topic>? Topics { get; set; }


		public virtual ICollection<Exam>? Exams { get; set; }


		public virtual ICollection<Class> Classes { get; set; } = new HashSet<Class>();

		public virtual ICollection<WaitList>? WaitList { get; set; }
	}
}
