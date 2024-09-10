using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class User
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int UserId { get; set; }

		public string? IPId { get; set; }

		[RegularExpression("Active|Archived", ErrorMessage ="Status must be 'Active' or 'Archived'.")]
		public string Status { get; set; } = "Active";

		[Required(ErrorMessage = "First Name is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "First name must be between 3 and 50 characters.")]
		public string FirstName { get; set; } = string.Empty;

		[Required(ErrorMessage = "Last Name is required.")]
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Last name must be between 3 and 50 characters.")]	
		public string LastName {  get; set; } = string.Empty;

		[StringLength(50, MinimumLength = 3, ErrorMessage = "Middle name must be between 3 and 50 characters.")]
		public string? MiddleName { get; set; }

		public bool IsAdmin { get; set; }

		public bool IsStudent { get; set; }

		public virtual Contact? Contact { get; set; } = new Contact(); 

		public virtual Employer? Employer { get; set; } = new Employer();

		public virtual Student? Student { get; set; } = new Student();
	}
}
