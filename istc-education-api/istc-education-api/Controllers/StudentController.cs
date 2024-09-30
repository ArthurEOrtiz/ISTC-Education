using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using System.Net;

namespace istc_education_api.Controllers
{
	public class StudentController : BaseController<Student>
	{
		public StudentController(DataContext context, ILogger<Student> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> Index(
			[FromQuery] int page = 1,
			[FromQuery] int limit = 10,
			[FromQuery] int? studentId = null,
			[FromQuery] string? email = null
			)
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}

			if (studentId != null && email != null)
			{
				return BadRequest("Cannot provide both studentId and email");
			}
			
			try
			{
				if (email != null)
				{
					var student = await _context.Users
						.Include(u => u.Contact)
						.Where(u => u.Contact!.Email == email)
						.SelectMany(u => _context.Students
							.Include(s => s.Attendances)
							.Include(s => s.WaitLists)
							.Include(s => s.Exams)
							.Where(s => s.UserId == u.UserId))
						.FirstOrDefaultAsync();

					if (student == null)
					{
						return NotFound("Student not found.");
					}

					return Ok(student);
				}
				else
				{
					var query = _context.Students
						.Include(s => s.Attendances)
						.Include(s => s.WaitLists)
						.Include(s => s.Exams)
						.AsQueryable();

					if (studentId != null)
					{
						query = query.Where(s => s.StudentId == studentId);
					}

					var students = await query
						.Skip((page - 1) * limit)
						.Take(limit)
						.ToListAsync();

					return Ok(students);
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting students");
				return BadRequest("Error getting students.");
			}
		}

		[HttpGet("Enrollment/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> Enrollment(
			int studentId,
			[FromQuery] int page = 1,
			[FromQuery] int limit = 10,
			[FromQuery] string? search = null,
			[FromQuery] List<CourseStatus>? status = null
		)
		{
			try
			{
				var student = await _context.Students.AnyAsync(s => s.StudentId == studentId);

				if (!student)
				{
					BadRequest("Student not found.");
				}

				var query = _context.Courses
					.Include(c => c.Location)
					.Include(c => c.Classes)
						.ThenInclude(c => c.Attendances)
					.Where(c => c.Classes.Any(c => c.Attendances!.Any(a => a.StudentId == studentId)))
					.AsQueryable();

				if (!string.IsNullOrEmpty(search))
				{
					query = query.Where(c =>
						c.Title.Contains(search) ||
						c.Description!.Contains(search) ||
						c.Location!.Description!.Contains(search) ||
						c.Location!.AddressLine1!.Contains(search) ||
						c.Location!.AddressLine2!.Contains(search) ||
						c.Location!.City!.Contains(search) ||
						c.Location!.State!.Contains(search) ||
						c.Location!.PostalCode!.Contains(search));
				}

				if (status != null)
				{
					query = query.Where(c => status.Contains(c.Status));
				}

				var courses = await query
					.Skip((page - 1) * limit)
					.Take(limit)
					.ToListAsync();

				foreach (var course in courses)
				{
					foreach (var @class in course.Classes)
					{
						@class.Attendances = null;
					}
				}

				return Ok(courses);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting student enrollment");
				return BadRequest("Error getting student enrollment.");
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
					.SelectMany(c => c.Attendances!)
					.AnyAsync(a => a.StudentId == studentId);

				return Ok(isEnrolled);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error checking if student is enrolled");
				return BadRequest("Error checking if student is enrolled.");
			}
		}

		[HttpPost("Enroll/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Enroll(int courseId, int studentId)
		{
			try
			{
				var student = await _context.Students
					.Include(s => s.Attendances)
					.FirstOrDefaultAsync(s => s.StudentId == studentId);

				if (student == null)
				{
					return NotFound("Student not found.");
				}

				var course = await _context.Courses
					.Include(c => c.Classes)
						.ThenInclude(c => c.Attendances)
					.FirstOrDefaultAsync(c => c.CourseId == courseId);

				if (course == null)
				{
					return NotFound("Course not found.");
				}

				if (course.Status != CourseStatus.Upcoming && course.Status != CourseStatus.InProgress)
				{
					return BadRequest("Course is not available for enrollment.");
				}

				// Check if student is already enrolled
				var existingEnrollment = course.Classes
					.SelectMany(c => c.Attendances!)
					.Any(a => a.StudentId == studentId);

				if (existingEnrollment)
				{
					return BadRequest("Student is already enrolled in this course.");
				}

				// Check if student is waitlisted
				var waitList = await _context.WaitLists
					.Where(w => w.StudentId == studentId && w.CourseId == courseId)
					.FirstOrDefaultAsync();

				if (waitList != null)
				{
					_context.WaitLists.Remove(waitList);
				}

				var attendances = new List<Attendance>();

				foreach (var @class in course.Classes)
				{
					var attendance = new Attendance
					{
						StudentId = studentId,
						ClassId = @class.ClassId,
						HasAttended = false
					};

					attendances.Add(attendance);
				}
				

				student.Attendances ??= []; // Ensure Attendances is not null
				student.Attendances.AddRange(attendances);
				await UpdateUserLastUpdated(studentId);
				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error enrolling student");
				return BadRequest("Error enrolling student.");
			}
		}

		[HttpDelete("Drop/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Drop(int courseId, int studentId)
		{
			try
			{
				var student = await _context.Students
					.Include(s => s.Attendances)
					.FirstOrDefaultAsync(s => s.StudentId == studentId);

				if (student == null)
				{
					return NotFound("Student not found.");
				}

				var course = await _context.Courses
					.Include(c => c.Classes)
						.ThenInclude(c => c.Attendances)
					.FirstOrDefaultAsync(c => c.CourseId == courseId);

				if (course == null)
				{
					return NotFound("Course not found.");
				}

				var attendances = student.Attendances?
					.Where(a => course.Classes.Any(c => c.ClassId == a.ClassId))
					.ToList() ?? [];

				if (student.Attendances != null)
				{
					attendances.ForEach(a => student.Attendances.Remove(a));
				}

				await _context.SaveChangesAsync();
				await UpdateUserLastUpdated(studentId);

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error unenrolling student");
				return BadRequest("Error unenrolling student.");
			}
		}


		[HttpPost("AddWaitlist/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> AddWaitlist(int courseId, int studentId)
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

				if (course.Status != CourseStatus.Upcoming && course.Status != CourseStatus.InProgress)
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
				};

				_context.WaitLists.Add(waitList);
				await UpdateUserLastUpdated(studentId);
				await _context.SaveChangesAsync();

				return Created();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error enrolling student");
				return BadRequest("Error enrolling student.");
			}
		}

		[HttpDelete("RemoveWaitlist/{courseId}/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> RemoveWaitlist(int courseId, int studentId)
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
				await UpdateUserLastUpdated(studentId);

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
