namespace istc_education_api.DTOs
{
	public class TopicDto
	{
		public int TopicId { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Created { get; set; } = string.Empty;
		public string? Description { get; set; }
		public virtual ICollection<CourseDto>? Courses { get; set; }
	}
}
