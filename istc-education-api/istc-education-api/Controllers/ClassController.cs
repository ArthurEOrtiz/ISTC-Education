using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ClassController : BaseController<Class>
	{
		public ClassController(DataContext context, ILogger<Class> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Index()
		{
			try
			{
				var classes = await _context.Classes
					.Include(c => c.Attendances)
					.ToListAsync();
				return Ok(classes);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting classes");
				return BadRequest();
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var @class = await _context.Classes
					.Include(c => c.Attendances)
					.FirstOrDefaultAsync(c => c.ClassId == id);
				if (@class == null)
				{
					return NotFound("Class not found.");
				}

				return Ok(@class);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting class");
				return BadRequest();
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] Class @class)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == @class.CourseId);

				if (course == null)
				{
					return NotFound("The parent course to the class was not found.");
				}

				_context.Classes.Add(@class);
				await _context.SaveChangesAsync();

				return CreatedAtAction(nameof(Details), new { id = @class.ClassId }, @class);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating class");
				return BadRequest("Error creating class.");
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Class @class)
		{
			if (id != @class.ClassId)
			{
				return BadRequest("Class ID mismatch.");
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Entry(@class).State = EntityState.Modified;

				if (@class.Attendances != null)
				{
					foreach (var attendance in @class.Attendances)
					{
						_context.Entry(attendance).State = EntityState.Modified;
					}
				}

				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (DbUpdateConcurrencyException ex)
			{
				if(!ClassExists(id))
				{
					return NotFound("Class no longer exists.");
				}
				else
				{
					_logger.LogError(ex, "Error updating class");
					return BadRequest("Error updating class.");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating class");
				return BadRequest("Error updating class.");
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var @class = await _context.Classes.FirstOrDefaultAsync(c => c.ClassId == id);
				if (@class == null)
				{
					return NotFound();
				}

				_context.Classes.Remove(@class);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting class");
				return BadRequest("Error deleting class.");
			}
		}

		private bool ClassExists(int id)
		{
			return _context.Classes.Any(c => c.ClassId == id);
		}

	}
}
