using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class StudentController : BaseController<Student>
	{
		public StudentController(DataContext context, ILogger<Student> logger) : base(context, logger)
		{
		}

		[HttpGet("Attendance/{email}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.NotFound)]
		public async Task<IActionResult> GetStudentAttendanceRecords(string email)
		{
			try
			{
				var student = await _context.Users
					.Include(u => u.Contact)
					.Where(u => u.Contact.Email == email)
					.SelectMany( u => _context.Students
						.Include(s => s.Attendances)
						.Include(s => s.WaitLists)
						.Where(s => s.UserId == u.UserId))
					.FirstOrDefaultAsync();

				if (student == null) {
					return NotFound("Student not found.");
				}

				return Ok(student);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting students");
				return BadRequest("Error getting students.");
			}
		}

		[HttpGet("IsStudentEnrolled/{courseId}/{studentId}")]
		public async Task<IActionResult> IsStudentEnrolled(int courseId, int studentId)
		{
			try
			{
				var isEnrolled = await _context.Courses
					.Where(c => c.CourseId == courseId)
					.SelectMany(c => c.Classes)
					.SelectMany(c => c.Attendances ?? new List<Attendance>())
					.AnyAsync(a => a.StudentId == studentId);

				return Ok(isEnrolled);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error checking if student is enrolled");
				return BadRequest("Error checking if student is enrolled.");
			}
		}

		[HttpPost("AddWaitQueue/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> AddWaitQueue(int courseId, int studentId)
		{

			try
			{
				var student = await _context.Students.FindAsync(studentId);

				if (student == null)
				{
					return NotFound("Student not found.");
				}

				var course = await _context.Courses.FindAsync(courseId);

				if (course == null)
				{
					return NotFound("Course not found.");
				}

				if (course.Status != CourseStatus.UpComing && course.Status != CourseStatus.InProgress)
				{
					return BadRequest("Course is not available for enrollment.");
				}

				var existingEnrollment = await _context.WaitLists
					.AnyAsync(w => w.StudentId == studentId && w.CourseId == courseId);

				if (existingEnrollment)
				{
					return BadRequest("Student is already waitlisted for this course.");
				}

				var waitList = new WaitList
				{
					StudentId = studentId,
					CourseId = courseId,
					DateAdded = DateTime.UtcNow,
					ToEnroll = true
				};

				_context.WaitLists.Add(waitList);
				await _context.SaveChangesAsync();

				return Created();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error enrolling student");
				return BadRequest("Error enrolling student.");
			}
		}

		[HttpDelete("RemoveWaitQueue/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> RemoveWaitQueue(int courseId, int studentId)
		{
			try
			{
				var waitList = await _context.WaitLists
					.Where(w => w.StudentId == studentId && w.CourseId == courseId)
					.FirstOrDefaultAsync();

				if (waitList == null)
				{
					return NotFound("Student is not waitlisted for this course.");
				}

				_context.WaitLists.Remove(waitList);
				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error removing student from waitlist");
				return BadRequest("Error removing student from waitlist.");
			}
		}



	}
}
