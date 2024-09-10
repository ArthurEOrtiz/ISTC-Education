using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Location
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int LocationId { get; set; }

		[ForeignKey("Course")]
		public int CourseId { get; set; }

		[StringLength(500, ErrorMessage = "Location description cannot be longer than 500 characters.")]
		public string? Description { get; set; }

		[StringLength(50, ErrorMessage = "Room cannot be longer than 50 characters.")]
		public string? Room { get; set; }

		[Url]
		public string? RemoteLink { get; set; }

		[StringLength(50, MinimumLength = 3, ErrorMessage = "Address Line 1 must be between 3 and 50 characters.")]
		public string? AddressLine1 { get; set; } 

		[StringLength(50, MinimumLength = 3, ErrorMessage = "Address Line 2 must be between 3 and 50 characters.")]
		public string? AddressLine2 { get; set; }

		[StringLength(50, MinimumLength = 3, ErrorMessage = "City must be between 3 and 50 characters.")]
		public string? City { get; set; } 

		[StringLength(14, MinimumLength = 4, ErrorMessage = "State must be between 4 and 14 characters.")]
		public string? State { get; set; }

		[StringLength(10, MinimumLength = 4, ErrorMessage = "Postal Code must be between 4 and 10 characters.")]
		public string? PostalCode { get; set; }
	}
}
