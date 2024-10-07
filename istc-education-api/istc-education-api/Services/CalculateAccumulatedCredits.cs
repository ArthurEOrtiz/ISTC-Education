using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.EntityFrameworkCore;

namespace istc_education_api.Services
{
	public class CalculateAccumulatedCredits : BackgroundService
	{
		private readonly IServiceProvider _serviceProvider;
		private readonly ILogger<CalculateAccumulatedCredits> _logger;

		public CalculateAccumulatedCredits(IServiceProvider serviceProvider, ILogger<CalculateAccumulatedCredits> logger)
		{
			_serviceProvider = serviceProvider;
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				await UpdateAccumulatedCredits(stoppingToken);
				await Task.Delay(TimeSpan.FromDays(1), stoppingToken); // Run once a day
			}
		}

		private async Task UpdateAccumulatedCredits(CancellationToken stoppingToken)
		{
			using (var scope = _serviceProvider.CreateScope())
			{
				var context = scope.ServiceProvider.GetRequiredService<DataContext>();

				try
				{
				
					var oneWeekAgo = DateTime.Now.AddDays(-7);
				
					var users = await context.Users
						.Include(u => u.Student!)
							.ThenInclude(s => s.Attendances)
						.Include(u => u.Student!)
							.ThenInclude(s => s.Exams)
						.Where(u => u.Student != null && u.Status != UserStatus.Archived && u.LastUpdated > oneWeekAgo)
						.ToListAsync(stoppingToken);


					var students = users.Select(u => u.Student!).ToList();

					foreach (var student in students)
					{
						if (stoppingToken.IsCancellationRequested)
						{
							return;
						}

						var completedCourses = await context.Courses
							.Include(c => c.Exams)
							.Include(c => c.Classes)
								.ThenInclude(c => c.Attendances)
							.Where(c => c.Classes.All(c => c.Attendances!.Any(a => a.StudentId == student.StudentId && a.HasAttended)))
							.ToListAsync(stoppingToken);

						var accumulatedCredits = 0;	

						foreach (var course in completedCourses)
						{
							accumulatedCredits += course.AttendanceCredit;

							if (course.Exams != null && course.Exams.Any(e => e.StudentId == student.StudentId && e.HasPassed) && course.ExamCredit.HasValue)
							{
								accumulatedCredits += course.ExamCredit.Value;
							}
						}

						student.AccumulatedCredits = accumulatedCredits;
					}

					await context.SaveChangesAsync(stoppingToken);
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Error calculating accumulated credits");
				}
			}
		}
	}
}
