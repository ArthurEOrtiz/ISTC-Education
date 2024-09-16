using istc_education_api.DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
	});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Kestrel to use the self-signed certificate
//builder.WebHost.ConfigureKestrel(options =>
//{
//    options.ListenAnyIP(5001, listenOptions =>
//    {
//        listenOptions.UseHttps("Properties/istceducation.pfx", "%TGB5tgb");
//    });
//});


builder.Services.AddDbContext<DataContext>(options => 
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddLogging();	

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage();
	app.UseSwagger();
	app.UseSwaggerUI();
	app.UseCors(policy =>
		policy.WithOrigins("http://localhost:3000")
			.AllowAnyMethod()
			.AllowAnyHeader());
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
