using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class CourseController : BaseController<Course>
	{
		public CourseController(DataContext context, ILogger<Course> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Index()
		{
			try
			{
				var courses = await _context.Courses
					.Include(c => c.Classes)
					.ToListAsync();
				return Ok(courses);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting courses");
				return BadRequest("Error getting courses.");
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var course = await GetCourseQuery().FirstOrDefaultAsync(c => c.CourseId == id);

				if (course == null)
				{
					return NotFound("Course not found.");
				}

				return Ok(course);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting course");
				return BadRequest("Error getting course.");
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
				if (course.Topics != null)
				{
					foreach (var topic in course.Topics)
					{
						if (_context.Entry(topic).State == EntityState.Detached)
						{
							_context.Topics.Attach(topic);
						}
					}
				}

				_context.Courses.Add(course);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = course.CourseId }, course);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating course");
				return BadRequest("Error creating course.");
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Course course)
		{
			if (id != course.CourseId)
			{
				return BadRequest("Course ID mismatch.");
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var existingCourse = await GetCourseQuery().FirstOrDefaultAsync(c => c.CourseId == id);

				if (existingCourse == null)
				{
					return NotFound("Course not found.");
				}

				_context.Entry(existingCourse).CurrentValues.SetValues(course);
				_context.Entry(existingCourse.Location).CurrentValues.SetValues(course.Location);

				UpdatePDF(existingCourse, course.PDF);

				UpdateClasses(existingCourse, course.Classes);
				
				if (course.Topics != null)
				{
					UpdateTopics(existingCourse, course.Topics);
				}

				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (DbUpdateConcurrencyException ex)
			{
				if (!CourseExists(id))
				{
					return NotFound("Course no longer exists.");
				}
				else
				{
					_logger.LogError(ex, "An unexpected number of rows were affected during saving");
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

		private IQueryable<Course> GetCourseQuery()
		{
			return _context.Courses
				.Include(c => c.Location)
				.Include(c => c.PDF)
				.Include(c => c.Topics)
				.Include(c => c.Exams)
				.Include(c => c.Classes)
				.Include(c => c.WaitList);
		}

		private void UpdateClasses(Course existingCourse, ICollection<Class> updatedClasses)
		{
			// Remove classes that are no longer in the updated list
			foreach (var existingClass in existingCourse.Classes.ToList())
			{
				if (!updatedClasses.Any(c => c.ClassId == existingClass.ClassId))
				{
					_context.Classes.Remove(existingClass);
				}
			}

			// Update existing classes or add new ones
			foreach (var updatedClass in updatedClasses) {
				var existingClass = existingCourse.Classes
					.FirstOrDefault(c => c.ClassId == updatedClass.ClassId);
				
				if (existingClass != null)
				{
					_context.Entry(existingClass).CurrentValues.SetValues(updatedClass);
				}
				else
				{
					existingCourse.Classes.Add(updatedClass);
				}
			}
		}

		private static void UpdateTopics(Course existingCourse, ICollection<Topic> updatedTopics)
		{
			// Topics have a many to many relationship with courses. When updating the topics
			// of a course, we do not need to delete any topics from the database. We only need to
			// edit the relationship between the course and the topics.


			// First Check if the existing course has any topics
			if (existingCourse.Topics != null)
			{
				// Remove topics that are no longer in the updated list
				foreach (var existingTopic in existingCourse.Topics.ToList())
				{
					if (!updatedTopics.Any(t => t.TopicId == existingTopic.TopicId))
					{
						existingCourse.Topics.Remove(existingTopic);
					}
				}

				// Add new topics to the course
				foreach (var updatedTopic in updatedTopics)
				{
					if (!existingCourse.Topics.Any(t => t.TopicId == updatedTopic.TopicId))
					{
						existingCourse.Topics.Add(updatedTopic);
					}
				}
			} else
			{
				// If the existing course has no topics, just add the new topics to the course
				existingCourse.Topics = updatedTopics;
			}
		}

		private void UpdatePDF(Course existingCourse, PDF? updatedPDF)
		{
			// If the update pdf is null remove the pdf attached the the existing course.
			if (updatedPDF == null && existingCourse.PDF != null)
			{
				_context.PDFs.Remove(existingCourse.PDF);
				existingCourse.PDF = null;
				existingCourse.HasPDF = false;
			}
			else if (updatedPDF != null)
			{
				// If the existing course has no pdf, add the new pdf to the course.
				if (existingCourse.PDF == null)
				{
					existingCourse.PDF = updatedPDF;
					existingCourse.HasPDF = true;
				}
				else
				{
					// If the existing course has a pdf, update the pdf.
					_context.Entry(existingCourse.PDF).CurrentValues.SetValues(updatedPDF);
				}
			}
		}
	}
}
