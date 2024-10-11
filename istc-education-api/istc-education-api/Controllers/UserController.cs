using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class UserController : BaseController<UserController>
	{
		public UserController(DataContext context, ILogger<UserController> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> Index(
			[FromQuery] int page = 1,
			[FromQuery] int limit = 10,
			[FromQuery] string? search = null,
			[FromQuery] string? IPId = null,
			[FromQuery] string? email = null,
			[FromQuery] int? studentId = null
			)
			
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}
			
			if (IPId != null || email != null || studentId.HasValue)
			{
				if (!string.IsNullOrEmpty(search))
				{
					return BadRequest("Cannot provide IPId, email, or studentId with search");
				}
			}

			try
			{
				var query = GetUserQuery().AsQueryable();

				if (!string.IsNullOrEmpty(search))
				{
					query = query.Where(u => 
						u.FirstName.Contains(search) ||
						u.MiddleName!.Contains(search) ||
						u.LastName.Contains(search) ||
						u.Contact!.Email.Contains(search));
				}

				if(!string.IsNullOrEmpty(IPId))
				{
					query = query.Where(u => u.IPId == IPId);
				}

				if (!string.IsNullOrEmpty(email))
				{
					query = query.Where(u => u.Contact!.Email == email);
				}

				if (studentId.HasValue)
				{
					query = query.Where(u => u.Student != null && u.Student.StudentId == studentId);
				}

				query = query.OrderBy(u => u.LastName);

				var users = await query
					.Skip((page - 1) * limit)
					.Take(limit)
					.ToListAsync();

				return Ok(users);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting users");
				return BadRequest();
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var user = await GetUserQuery()
					.Include(u => u.Student)
						.ThenInclude(s => s!.Certifications)
					.FirstOrDefaultAsync(u => u.UserId == id);

				if (user == null)
				{
					return NotFound("User not found.");
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting user");
				return BadRequest();
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] User user)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Users.Add(user);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = user.UserId }, user);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating user");
				return BadRequest("Error creating user");
			}
		}
		[HttpGet("WithCertifications")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> GetUsersWithCertifications(
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
				var query = _context.Users
						.Include(u => u.Student)
							.ThenInclude(s => s!.Certifications)
						.Include(u => u.Contact)
						.Include(u => u.Employer)
						.Where(u => u.Student != null && u.Student.Certifications != null && u.Student.Certifications.Count != 0)
						.AsQueryable();

				if (!string.IsNullOrEmpty(search))
				{
					query = query.Where(u =>
						u.FirstName.Contains(search) ||
						u.MiddleName!.Contains(search) ||
						u.LastName.Contains(search) ||
						u.Contact!.Email.Contains(search) ||
						u.Employer!.EmployerName.Contains(search) ||
						u.Employer.JobTitle.Contains(search)	
						);
				}

				var users = await query
						.Skip((page - 1) * limit)
						.Take(limit)
						.ToListAsync();

				return Ok(users);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting users with certifications");
				return BadRequest("Error getting users with certifications");
			}
		}


		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] User updatedUser)
		{
			if (id != updatedUser.UserId)
			{
				return BadRequest("User ID mismatch");
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			try
			{
				var currentUser = await _context.Users
					.Include(u => u.Contact)
					.Include(u => u.Employer)
					.Include(u => u.Student)
						.ThenInclude(s => s!.Certifications)
					.FirstOrDefaultAsync(u => u.UserId == id);

				if (currentUser == null)
				{
					return NotFound("User not found.");
				}

				_context.Entry(currentUser).CurrentValues.SetValues(updatedUser);

				if (currentUser.Contact != null && updatedUser.Contact != null)
				{
					_context.Entry(currentUser.Contact).CurrentValues.SetValues(updatedUser.Contact);
				}

				if (currentUser.Employer != null && updatedUser.Employer != null)
				{
					_context.Entry(currentUser.Employer).CurrentValues.SetValues(updatedUser.Employer);
				}

				if (currentUser.Student != null && updatedUser.Student != null)
				{
					_context.Entry(currentUser.Student).CurrentValues.SetValues(updatedUser.Student);

					if (updatedUser.Student.Certifications != null)
					{
						UpdateCertifications(currentUser.Student, updatedUser.Student.Certifications);
					}
				}

				currentUser.LastUpdated = DateTime.UtcNow;

				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch(DbUpdateConcurrencyException ex)
			{
				if (!UserExists(id))
				{
					return NotFound("User does not exists.");
				}
				else
				{
					_logger.LogError(ex, "An unexpected number of row were affected during saving");
					return BadRequest("Error updating user");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating user");
				return BadRequest("Error updating user");
			}
		}

		private void UpdateCertifications(Student currentUserStudent, ICollection<Certification> updatedCertifications)
		{
			currentUserStudent.Certifications ??= new List<Certification>();

			var certificationsToRemove = currentUserStudent.Certifications
					.Where(c => !updatedCertifications.Any(uc => uc.CertificationId == c.CertificationId))
					.ToList();

			foreach (var certification in certificationsToRemove)
			{
				currentUserStudent.Certifications.Remove(certification);
			}

			foreach (var certification in updatedCertifications)
			{
				var existingCertification = currentUserStudent.Certifications
						.FirstOrDefault(c => c.CertificationId == certification.CertificationId);

				if (existingCertification == null)
				{
					currentUserStudent.Certifications.Add(certification);
				}
				else
				{
					_context.Entry(existingCertification).CurrentValues.SetValues(certification);
				}
			}
		}




		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
				if (user == null)
				{
					return NotFound();
				}

				_context.Users.Remove(user);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting user");
				return BadRequest("Error deleting user");
			}
		}

		private IQueryable<User> GetUserQuery()
		{
			return _context.Users
				.Include(u => u.Contact)
				.Include(u => u.Employer)
				.Include(u => u.Student);
					
		}

		private bool UserExists(int id)
		{
			return _context.Users.Any(e => e.UserId == id);
		}
	}
}
