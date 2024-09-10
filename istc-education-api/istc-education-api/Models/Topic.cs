using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Topic
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int TopicId { get; set; }

		[Required(ErrorMessage = "Title is required.")]
		[StringLength(50, MinimumLength = 3)]
		public string Title { get; set; } = string.Empty;

		[StringLength(500, MinimumLength = 3, ErrorMessage ="Description must be between 3 and 500 characters.")]
		public string? Description { get; set; }

		public virtual HashSet<Course> Courses { get; set; } = [];
	}
}
