using Microsoft.EntityFrameworkCore;
using istc_education_api.Models;

namespace istc_education_api.DataAccess
{
	public class DataContext : DbContext
	{
		public DataContext(DbContextOptions<DataContext> options) : base(options)
		{
		}

		public DbSet<Attendance> Attendances { get; set; } = default!;
		public DbSet<Certification> Certifications { get; set; } = default!;
		public DbSet<Class> Classes { get; set; } = default!;
		public DbSet<Contact> Contacts { get; set; } = default!;
		public DbSet<Course> Courses { get; set; } = default!;
		public DbSet<Employer> Employers { get; set; } = default!;
		public DbSet<Exam> Exams { get; set; } = default!;
		public DbSet<Location> Locations { get; set; } = default!;
		public DbSet<PDF> PDFs { get; set; } = default!;
		public DbSet<Student> Students { get; set; } = default!;
		public DbSet<Topic> Topics { get; set; } = default!;
		public DbSet<User> Users { get; set; } = default!;

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Course>()
				.Property(c => c.Status)
				.HasConversion<string>();
		}
	}
}
