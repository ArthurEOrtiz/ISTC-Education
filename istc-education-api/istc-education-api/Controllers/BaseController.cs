using istc_education_api.DataAccess;
using Microsoft.AspNetCore.Mvc;

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
	}
}
