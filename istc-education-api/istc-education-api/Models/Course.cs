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
		public virtual HashSet<Topic>? Topics { get; set; }

		// same kind of logic here, but this is a one-to-many relationship.
		public virtual HashSet<Exam>? Exams { get; set; }

		// Here, I'm usig a combination of things.
		// This should be a unique list of classes riiiighhht? 
		// you cant carbon copy a class to another course, nor have the same class in
		// the same course twice. this is because child classes are linked to attendance records
		// which should never by modified after creation. and they are unique events in time and location.
		public virtual HashSet<Class> Classes { get; set; } = [];

		public virtual HashSet<WaitList>? WaitList { get; set; }
	}
}
