using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class Certification
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CertificationId { get; set; }

		[ForeignKey("Student")]
		public int StudentId { get; set; }

		[RegularExpression("Appraiser|Mapping", ErrorMessage = "Certification type must be 'Appraiser' or 'Mapping'")]
		public string CertificationType { get; set; } = string.Empty;

		public DateTime RequestedDate { get; set; } = DateTime.UtcNow;

		public DateTime? ReviewDate { get; set; }

		public bool IsApproved { get; set; } = false;

		public int? ApprovedBy { get; set; } 
		
	}
}
