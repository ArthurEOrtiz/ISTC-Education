using istc_education_api.DataAccess;
using istc_education_api.DTOs;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class TopicController : BaseController<Topic>
	{
		public TopicController(DataContext context, ILogger<Topic> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Index(
			[FromQuery] int page = 1,
			[FromQuery] int limit = 10,
			[FromQuery] string? search = null
			)
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}

			try
			{
				var query = _context.Topics
				.AsQueryable();


				if (!string.IsNullOrWhiteSpace(search))
				{
					query = query.Where(t =>
						t.Title.Contains(search) ||
						t.Description!.Contains(search));
				}

				query = query.OrderBy(t => t.Created);

				var topics = await query
					.Skip((page - 1) * limit)
					.Take(limit)
					.ToListAsync();

				return Ok(topics);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting topics");
				return BadRequest("Error getting topics.");
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var topic = await _context.Topics
				.Include(t => t.Courses)
				.FirstOrDefaultAsync(t => t.TopicId == id);

				if (topic == null)
				{
					return NotFound("Topic not found.");
				}

				var topicDto = new TopicDto()
				{
					TopicId = topic.TopicId,
					Title = topic.Title,
					Created = topic.Created.ToString("yyyy-MM-dd"),
					Description = topic.Description,
					Courses = topic.Courses?.Select(c => new CourseDto()
					{
						CourseId = c.CourseId,
						Title = c.Title,
						Status = c.Status.ToString(),
						Description = c.Description,
						AttendanceCredit = c.AttendanceCredit,
						MaxAttendance = c.MaxAttendance,
						EnrollmentDeadline = c.EnrollmentDeadline.ToString("yyyy-MM-dd"),
						InstructorName = c.InstructorName,
						InstructorEmail = c.InstructorEmail,
						HasExam = c.HasExam,
						HasPDF = c.HasPDF,
					}).ToList()
				};

				return Ok(topicDto);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting topic");
				return BadRequest("Error getting topic.");
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] Topic topic)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Topics.Add(topic);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = topic.TopicId }, null);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating topic");
				return BadRequest("Error creating topic.");
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Topic topic)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var existingTopic = await _context.Topics
					.Include(t => t.Courses)
					.FirstOrDefaultAsync(t => t.TopicId == id);

				if (existingTopic == null)
				{
					return NotFound("Topic not found.");
				}

				_context.Entry(existingTopic).CurrentValues.SetValues(topic);

				UpdateCourses(existingTopic, topic.Courses);

				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating topic");
				return BadRequest("Error updating topic.");
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var topic = await _context.Topics.FirstOrDefaultAsync(t => t.TopicId == id);

				if (topic == null)
				{
					return NotFound("Topic not found.");
				}

				_context.Topics.Remove(topic);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting topic");
				return BadRequest("Error deleting topic.");
			}
		}

		private void UpdateCourses(Topic existingTopic, ICollection<Course>? updatedCourses)
		{
			if (updatedCourses == null)
			{
				existingTopic.Courses = null;
				return;
			}

			if (existingTopic.Courses != null)
			{
				// Remove courses that are no longer in the updated list
				foreach (var existingCourse in existingTopic.Courses.ToList())
				{
					if (!updatedCourses.Any(c => c.CourseId == existingCourse.CourseId))
					{
						existingTopic.Courses.Remove(existingCourse);
					}
				}

				// Add new courses to the topic
				foreach (var updatedCourse in updatedCourses)
				{
					if (!existingTopic.Courses.Any(c => c.CourseId == updatedCourse.CourseId))
					{
						existingTopic.Courses.Add(updatedCourse);
					}
				}
			}
			else
			{
				// If the existing topic has no courses, just add the new courses to the topic
				existingTopic.Courses = updatedCourses;
			}
		}
	}
}
