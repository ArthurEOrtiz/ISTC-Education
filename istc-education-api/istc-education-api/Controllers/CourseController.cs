using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CourseController : ControllerBase
	{
		private readonly DataContext _context;
		private readonly ILogger<UserController> _logger;

		public CourseController(DataContext context, ILogger<UserController> logger)
		{
			_context = context;
			_logger = logger;
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Index()
		{
			try
			{
				var courses = await _context.Courses
					.Include(c => c.Exams)
					.ToListAsync();
				return Ok(courses);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting courses");
				return BadRequest();
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var course = await _context.Courses
					.Include(c => c.Exams)
					.FirstOrDefaultAsync(c => c.CourseId == id);
				if (course == null)
				{
					return NotFound();
				}

				return Ok(course);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting course");
				return BadRequest();
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] Course course)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Courses.Add(course);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = course.CourseId }, course);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating course");
				return BadRequest("Error creating course");
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Course course)
		{
			try
			{
				if (id != course.CourseId)
				{
					return BadRequest("Course ID mismatch");
				}

				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}

				_context.Entry(course).State = EntityState.Modified;

				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (DbUpdateConcurrencyException ex)
			{
				if (!CourseExists(id))
				{
					return NotFound();
				}
				else
				{
					_logger.LogError(ex, "An unexpected number of were affected during saving");
					return BadRequest("Error updating course");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating course");
				return BadRequest("Error updating course");
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == id);
				if (course == null)
				{
					return NotFound();
				}

				_context.Courses.Remove(course);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting course");
				return BadRequest("Error deleting course");
			}
		}

		private bool CourseExists(int id)
		{
			return _context.Courses.Any(c => c.CourseId == id);
		}
	}
}
