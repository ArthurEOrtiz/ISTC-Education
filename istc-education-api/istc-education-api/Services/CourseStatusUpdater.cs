using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.EntityFrameworkCore;

namespace istc_education_api.Services
{
	public class CourseStatusUpdater : BackgroundService
	{
		private readonly IServiceProvider _serviceProvider;
		private readonly ILogger<CourseStatusUpdater> _logger;

		public CourseStatusUpdater(IServiceProvider serviceProvider, ILogger<CourseStatusUpdater> logger)
		{
			_serviceProvider = serviceProvider;
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				await UpdateCourseStatuses();
				await Task.Delay(TimeSpan.FromDays(1), stoppingToken); // Run once a day
			}
		}

		private async Task UpdateCourseStatuses()
		{
			using (var scope = _serviceProvider.CreateScope())
			{
				var context = scope.ServiceProvider.GetRequiredService<DataContext>();

				try
				{
					var courses = await context.Courses
						.Include(c => c.Classes)
						.Where(c => c.Status == CourseStatus.UpComing || c.Status == CourseStatus.InProgress)
						.ToListAsync();

					foreach (var course in courses)
					{
						var firstClass = course.Classes.OrderBy(c => c.Date).FirstOrDefault();
						var lastClass = course.Classes.OrderByDescending(c => c.Date).FirstOrDefault();
						var today = DateOnly.FromDateTime(DateTime.Now);

						if (firstClass != null && lastClass != null)
						{
							if(today > firstClass.Date && today < lastClass.Date)
							{
								course.Status = CourseStatus.InProgress;
							}
							else if (today > lastClass.Date)
							{
								course.Status = CourseStatus.Completed;
							}
						}

					}

					await context.SaveChangesAsync();
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Error updating course statuses");
				}
			}
		}
	}
}
