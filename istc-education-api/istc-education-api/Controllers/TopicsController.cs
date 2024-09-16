using istc_education_api.DataAccess;
using istc_education_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace istc_education_api.Controllers
{
	public class TopicsController : BaseController<Topic>
	{
		public TopicsController(DataContext context, ILogger<Topic> logger) : base(context, logger)
		{
		}

		[HttpGet]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Index()
		{
			try
			{
				var topics = await _context.Topics.ToListAsync();
				return Ok(topics);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting topics");
				return BadRequest("Error getting topics.");
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType((int)HttpStatusCode.OK)]
		public async Task<IActionResult> Details(int id)
		{
			try
			{
				var topic = await _context.Topics
					.Include(t => t.Courses)
					.FirstOrDefaultAsync(t => t.TopicId == id);

				if (topic == null)
				{
					return NotFound("Topic not found.");
				}

				return Ok(topic);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting topic");
				return BadRequest("Error getting topic.");
			}
		}

		[HttpPost]
		[ProducesResponseType((int)HttpStatusCode.Created)]
		public async Task<IActionResult> Create([FromBody] Topic topic)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Topics.Add(topic);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(Details), new { id = topic.TopicId }, topic);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating topic");
				return BadRequest("Error creating topic.");
			}
		}

		[HttpPut("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Update(int id, [FromBody] Topic topic)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
			  _context.Entry(topic).State = EntityState.Modified;
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating topic");
				return BadRequest("Error updating topic.");
			}
		}

		[HttpDelete("{id}")]
		[ProducesResponseType((int)HttpStatusCode.NoContent)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var topic = await _context.Topics.FirstOrDefaultAsync(t => t.TopicId == id);

				if (topic == null)
				{
					return NotFound("Topic not found.");
				}

				_context.Topics.Remove(topic);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting topic");
				return BadRequest("Error deleting topic.");
			}
		}
	}
}
