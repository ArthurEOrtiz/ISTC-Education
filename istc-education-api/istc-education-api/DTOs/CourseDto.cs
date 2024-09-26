using istc_education_api.Models;

namespace istc_education_api.DTOs
{
	public class CourseDto
	{
		public int CourseId { get; set; }
		public string Status { get; set; } = string.Empty;
		public string Title { get; set; } = string.Empty;
		public string? Description { get; set; }
		public int AttendanceCredit { get; set; }
		public int MaxAttendance { get; set; }
		public string EnrollmentDeadline { get; set; } = string.Empty;
		public string InstructorName { get; set; } = string.Empty;
		public string? InstructorEmail { get; set; }
		public bool HasExam { get; set; }
		public int? ExamCredit { get; set; }
		public bool HasPDF { get; set; }
		public Location Location { get; set; } = new Location();
		public PDF? PDF { get; set; }
		public ICollection<TopicDto>? Topics { get; set; }
		public ICollection<Exam>? Exams { get; set; }
		public ICollection<Class> Classes { get; set; } = new HashSet<Class>();
		public ICollection<WaitList>? WaitList { get; set; }

	}
}
