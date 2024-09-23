using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace istc_education_api.Controllers
{
	public class AttendanceController : BaseController<Attendance>
	{
		public AttendanceController(DataContext context, ILogger<Attendance> logger) : base(context, logger)
		{
		}

		[HttpGet()]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> Index(
		[FromQuery] int page = 1,
		[FromQuery] int limit = 10,
		[FromQuery] int? classId = null
		)
		{
			if (page < 1 || limit < 1)
			{
				return BadRequest("Invalid page or limit");
			}

			try
			{
				var query = _context.Attendances.AsQueryable();

				if (classId.HasValue)
				{
					query = query.Where(a => a.ClassId == classId);
				}

				var attendances = await query
					.Skip((page - 1) * limit)
					.Take(limit)
					.ToListAsync();

				return Ok(attendances);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting attendances");
				return BadRequest("Error getting attendances.");
			}
		}

		[HttpPut]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		[ProducesResponseType((int)HttpStatusCode.BadRequest)]
		public async Task<IActionResult> UpdateAttendances([FromBody] JsonElement input)
		{
			if (input.ValueKind == JsonValueKind.Null)
			{
				return BadRequest("Input cannot be null");
			}

			try
			{
				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					PropertyNamingPolicy = JsonNamingPolicy.CamelCase
				};


				if (input.ValueKind == JsonValueKind.Object)
				{
					var singleAttendance = JsonSerializer.Deserialize<Attendance>(input.GetRawText(), options);
					if (singleAttendance != null)
					{
						if (!await _context.Students.AnyAsync(s => s.StudentId == singleAttendance.StudentId))
						{
							return BadRequest($"StudentId {singleAttendance.StudentId} does not exist.");
						}
						_context.Attendances.Update(singleAttendance);
					}
					else
					{
						return BadRequest("Invalid input type");
					}
				}
				else if (input.ValueKind == JsonValueKind.Array)
				{
					var attendancesArray = JsonSerializer.Deserialize<Attendance[]>(input.GetRawText(), options);
					if (attendancesArray != null)
					{
						foreach (var attendance in attendancesArray)
						{
							if (!await _context.Students.AnyAsync(s => s.StudentId == attendance.StudentId))
							{
								return BadRequest($"StudentId {attendance.StudentId} does not exist.");
							}
						}
						_context.Attendances.UpdateRange(attendancesArray);
					}
					else
					{
						return BadRequest("Invalid input type");
					}
				}
				else
				{
					return BadRequest("Invalid input type");
				}

				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating attendances");
				return BadRequest("Error updating attendances.");
			}
		}


	}
}
