using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class CertificationController : BaseController<CertificationController>
	{
		public CertificationController(DataContext context, ILogger<CertificationController> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> Index(
			[FromQuery] int page = 1,
			[FromQuery] int limit = 10,
			[FromQuery] int? certId = null,
			[FromQuery] int? studentId = null,
			[FromQuery] CertificationType? certType = null
			)
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}

			try
			{
				var query = _context.Certifications.AsQueryable();

				if (certId.HasValue)
				{
					query = query.Where(c => c.CertificationId == certId);
				}

				if (studentId.HasValue)
				{
					query = query.Where(c => c.StudentId == studentId);
				}

				if (certType.HasValue)
				{
					query = query.Where(c => c.Type == certType);
				}

				var certifications = await query
					.Skip((page - 1) * limit)
					.Take(limit)
					.ToListAsync();

				return Ok(certifications);
			}
			catch (Exception ex) {
				_logger.LogError(ex, "Error getting certifications");
				return BadRequest("Error getting certifications");
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var certification = await _context.Certifications
					.FirstOrDefaultAsync(c => c.CertificationId == id);

				if (certification == null)
				{
					return NotFound("Certification not found.");
				}

				return Ok(certification);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting certification details");
				return BadRequest();
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] Certification certification)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Certifications.Add(certification);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = certification.CertificationId }, certification);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating certification");
				return BadRequest();
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Certification certification)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var existingCertification = await _context.Certifications
					.FirstOrDefaultAsync(c => c.CertificationId == id);

				if (existingCertification == null)
				{
					return NotFound("Certification not found.");
				}
				
				_context.Entry(existingCertification).CurrentValues.SetValues(certification);

				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating certification");
				return BadRequest();
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var certification = await _context.Certifications
					.FirstOrDefaultAsync(c => c.CertificationId == id);

				if (certification == null)
				{
					return NotFound("Certification not found.");
				}

				_context.Certifications.Remove(certification);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting certification");
				return BadRequest();
			}
		}


	}
}
