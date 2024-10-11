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

		[Required(ErrorMessage = "Certification Type is required.")]
		[EnumDataType(typeof(CertificationType), ErrorMessage = "Certification Type must be 'Mapping' or 'Appraiser'.")]
		public CertificationType Type { get; set; } 

		public DateTime RequestedDate { get; set; } = DateTime.UtcNow;

		public DateTime? ReviewDate { get; set; }

		public bool IsApproved { get; set; } = false;

		public int? ApprovedBy { get; set; } 
		
	}
}
