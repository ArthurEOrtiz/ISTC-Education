using istc_education_api.DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace istc_education_api.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public abstract class BaseController<T> : ControllerBase
	{
		protected readonly DataContext _context;
		protected readonly ILogger<T> _logger;

		protected BaseController(DataContext context, ILogger<T> logger)
		{
			_context = context;
			_logger = logger;
		}

		[NonAction]
		public async Task UpdateUserLastUpdated(int studentId)
		{
			try
			{
				var user = await _context.Users
					.Include(u => u.Student)
					.FirstOrDefaultAsync(u => u.Student!.StudentId == studentId);

				if (user == null)
				{
					_logger.LogWarning("User not found for id {studentId}", studentId);
					return;
				}

				user.LastUpdated = DateTime.UtcNow;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating user last updated");
			}
		}
	}
}
