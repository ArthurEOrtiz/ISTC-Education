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
		public async Task<IActionResult> Index([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? search = null)
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}

			try
			{
				var query = _context.Users
					.Include(u => u.Contact)
					.Include(u => u.Student)
					.AsQueryable();

				if (!string.IsNullOrEmpty(search))
				{
					query = query.Where(u => 
						u.FirstName.Contains(search) ||
						u.MiddleName!.Contains(search) ||
						u.LastName.Contains(search) ||
						u.Contact!.Email.Contains(search));
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
				var user = await GetUserQuery().FirstOrDefaultAsync(u => u.UserId == id);
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

		[HttpGet("IPId/{IPId}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> GetUserByIdentityProviderId(string IPId)
		{
			try
			{
				var user = await GetUserQuery().FirstOrDefaultAsync(u => u.IPId == IPId);

				if (user == null)
				{
					return NotFound("User not found");
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting user");
				return BadRequest("Error getting user");
			}
		}

		[HttpGet("Email/{email}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> GetUserByEmail(string email)
		{
			try
			{
				var contact = await _context.Contacts.FirstOrDefaultAsync(c => c.Email == email);

				if (contact == null) {
					return NotFound("Contact not found");
				}

				var user = await GetUserQuery().FirstOrDefaultAsync(u => u.UserId == contact.UserId);

				if (user == null)
				{
					return NotFound("User not found");
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting user");
				return BadRequest("Error getting user");
			}
		}

		[HttpGet("StudentId/{studentId}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> GetUserByStudentId(int studentId)
		{
			try
			{
				var user = await _context.Users
					.Include(u => u.Contact)
					.Include(u => u.Student)
					.Where(u => u.Student != null && u.Student.StudentId == studentId)
					.FirstOrDefaultAsync();

				if (user == null)
				{
					return NotFound("User not found.");
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting user.");
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

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] User user)
		{
			try
			{
				if (id != user.UserId)
				{
					return BadRequest("User ID mismatch");
				}

				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}

				_context.Entry(user).State = EntityState.Modified;

				if (user.Contact != null)
				{
					_context.Entry(user.Contact).State = EntityState.Modified;
				}

				if (user.Employer != null)
				{
					_context.Entry(user.Employer).State = EntityState.Modified;
				}

				if (user.Student != null)
				{
					_context.Entry(user.Student).State = EntityState.Modified;
				}
			
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch(DbUpdateConcurrencyException ex)
			{
				if (!UserExists(id))
				{
					return NotFound("User no longer exists.");
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
