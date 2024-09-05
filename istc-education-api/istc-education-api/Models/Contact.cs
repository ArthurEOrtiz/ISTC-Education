using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Contact
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int ContactId { get; set; }

		[ForeignKey("User")]
		public int UserId { get; set; }

		[Required]
		[EmailAddress]
		public string Email { get; set; } = string.Empty;

		[Phone]
		public string? Phone { get; set; }

		[StringLength(50, MinimumLength = 3, ErrorMessage = "Address Line 1 must be between 3 and 50 characters")]
		public string? AddressLine1 { get; set; }

		[StringLength(50, MinimumLength = 3, ErrorMessage = "Address Line 2 must be between 3 and 50 characters")]
		public string? AddressLine2 { get; set; }

		[StringLength(50, MinimumLength = 3, ErrorMessage = "City must be between 3 and 50 characters")]
		public string? City { get; set; }

		[StringLength(14, MinimumLength = 4, ErrorMessage = "State must be between 4 and 14 characters")]
		public string? State { get; set; }

		[StringLength(10, MinimumLength = 4, ErrorMessage = "Postal Code must be between 4 and 10 characters")]
		public string? PostalCode { get; set; }

	}
}
