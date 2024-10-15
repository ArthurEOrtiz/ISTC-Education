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

	public string GenerateEmailBody(string header, string body, string year)
	{
		return $@"
            <!DOCTYPE html>
            <html lang=""en"">
            <head>
                <meta charset=""UTF-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{
                        background-color: #0047ab;
                        padding: 10px;
                        text-align: center;
                        color: #ffffff;
                    }}
                    .content {{
                        padding: 20px;
                        text-align: left;
                    }}
                    .content h1 {{
                        font-size: 24px;
                        color: #333333;
                    }}
                    .content p {{
                        font-size: 16px;
                        color: #666666;
                        line-height: 1.6;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        color: #999999;
                        font-size: 12px;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #0047ab;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }}
                </style>
            </head>
            <body>
                <div class=""container"">
                    <div class=""header"">
                        <h2>{header}</h2>
                    </div>
                    <div class=""content"">
                       {body}
                    </div>
                    <div class=""footer"">
                        <p>&copy; {year} Idaho State Tax Commission. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>";
	}
}
