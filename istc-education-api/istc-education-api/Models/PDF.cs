using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace istc_education_api.Models
{
	public class PDF
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int PDFId { get; set; }

		[ForeignKey("Course")]
		public int CourseId { get; set; }

		[Required(ErrorMessage = "File Name is required.")]
		[StringLength(100, MinimumLength = 5, ErrorMessage = "The file name must be between 5 and 100 characters long.")]
		[FileExtensions(Extensions = "pdf", ErrorMessage = "The file must be a PDF.")]
		public string FileName { get; set; } = string.Empty;

		[Required(ErrorMessage = "Data is required.")]
		[MinLength(1, ErrorMessage = "The file must be at least 1 byte.")]
		public byte[] Data { get; set; } = [];
	}
}
