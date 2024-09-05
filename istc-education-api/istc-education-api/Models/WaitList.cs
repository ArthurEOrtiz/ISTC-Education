using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class WaitList
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int WaitListId { get; set; }

		[ForeignKey("Course")]
		public int CourseId { get; set; }

		[ForeignKey("Student")]
		public int StudentId { get; set; }

		public DateTime DateAdded { get; set; }

		public bool ToEnroll { get; set; }
	}
}
