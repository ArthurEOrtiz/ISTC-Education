using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Employer
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int EmployerId { get; set; }

		[ForeignKey("User")]
		public int UserId { get; set; }

		[Required(ErrorMessage = "Employer is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Employer must be between 3 and 50 characters.")]
		public string EmployerName { get; set; } = string.Empty;

		[Required(ErrorMessage = "Job Title is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Job Title must be between 3 and 50 characters long.")]
		public string JobTitle { get; set; } = string.Empty;
	}
}
