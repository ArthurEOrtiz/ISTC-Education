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

		[Required]
		[StringLength(50, MinimumLength = 3)]
		public string EmployerName { get; set; } = string.Empty;

		[Required]
		[StringLength(50, MinimumLength = 3)]
		public string JobTitle { get; set; } = string.Empty;
	}
}
