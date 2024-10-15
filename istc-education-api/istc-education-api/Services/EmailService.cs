using System.Net;
using System.Net.Mail;

public class EmailService
{
	private readonly SmtpClient _smtpClient;

	public EmailService(IConfiguration configuration)
	{
		var smtpSettings = configuration.GetSection("SmtpSettings");
		string? host = smtpSettings["Host"];
		int port = int.Parse(smtpSettings["Port"] ?? "0");
		bool enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "false");
		string? username = smtpSettings["Username"];
		string? password = smtpSettings["Password"];

		if (host == null)
		{
			throw new ArgumentNullException(nameof(configuration), "SMTP host is not configured properly.");
		}

		if (username == null)
		{
			throw new ArgumentNullException(nameof(configuration), "SMTP username is not configured properly.");
		}

		if (password == null)
		{
			throw new ArgumentNullException(nameof(configuration), "SMTP password is not configured properly.");
		}

		_smtpClient = new SmtpClient(host, port)
		{
			EnableSsl = enableSsl,
			Credentials = new NetworkCredential(username, password)
		};
	}

	public async Task SendEmailAsync(string to, string subject, string body)
	{
		var mailMessage = new MailMessage
		{
			From = new MailAddress("no_reply@tax.idaho.gov"),
			Subject = subject,
			Body = body,
			IsBodyHtml = true
		};

		mailMessage.To.Add(to);

		try
		{
			await _smtpClient.SendMailAsync(mailMessage);

		}
		catch (Exception ex)
		{
			throw new Exception("Error sending email", ex);
		}
	}
}
