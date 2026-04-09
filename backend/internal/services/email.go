package services

import (
	"fmt"
	"net/smtp"
	"os"
)

// SendEmail sends a generic HTML email message using the configured SMTP credentials.
func SendEmail(to []string, subject, body string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	senderEmail := os.Getenv("SMTP_USER")
	senderPassword := os.Getenv("SMTP_PASS")

	if host == "" || port == "" || senderEmail == "" || senderPassword == "" {
		return fmt.Errorf("SMTP environment variables are not fully configured")
	}

	auth := smtp.PlainAuth("", senderEmail, senderPassword, host)

	// Combine standard Headers and HTML body
	header := make(map[string]string)
	header["From"] = fmt.Sprintf("BudgetFlow <%s>", senderEmail)
	header["To"] = to[0]
	header["Subject"] = subject
	header["MIME-Version"] = "1.0"
	header["Content-Type"] = "text/html; charset=\"utf-8\""

	message := ""
	for k, v := range header {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body

	addr := fmt.Sprintf("%s:%s", host, port)

	// Set up TLS manually because sometimes smtp.SendMail struggles with explicit TLS setups internally
	// For standard port 587 (STARTTLS), standard SendMail is usually fine:
	err := smtp.SendMail(addr, auth, senderEmail, to, []byte(message))
	if err != nil {
		// If StartTLS fails, some providers require manual TLS config, but net/smtp does this internally
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}

// SendVerificationEmail specifically constructs the verification email content
func SendVerificationEmail(to, token string) error {
	baseURL := os.Getenv("NEXT_PUBLIC_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000" // fallback
	}

	verificationLink := fmt.Sprintf("%s/auth/verify?token=%s", baseURL, token)

	body := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f2f3ff; margin: 0; padding: 40px; color: #131b2e;">
		<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 88, 190, 0.05);">
			<h4 style="color: #0058be; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; margin-top: 0; margin-bottom: 24px; text-transform: uppercase;">BudgetFlow</h4>
			<h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify your email address</h1>
			<p style="font-size: 16px; line-height: 1.6; color: #424754; margin-bottom: 32px;">Welcome to BudgetFlow! To complete your registration and unlock full financial clarity, simply click the button below to verify your email address.</p>
			
			<a href="%s" style="display: inline-block; background-color: #0058be; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">Verify Email Address</a>
			
			<p style="font-size: 14px; color: #727785; margin-bottom: 0;">If you didn't create an account, you can safely ignore this email.</p>
		</div>
	</body>
	</html>
	`, verificationLink)

	return SendEmail([]string{to}, "Verify your BudgetFlow account", body)
}

// SendPasswordResetEmail constructs the password reset email content
func SendPasswordResetEmail(to, token string) error {
	baseURL := os.Getenv("NEXT_PUBLIC_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000" // fallback
	}

	resetLink := fmt.Sprintf("%s/auth/reset-password?token=%s", baseURL, token)

	body := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f2f3ff; margin: 0; padding: 40px; color: #131b2e;">
		<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 88, 190, 0.05);">
			<h4 style="color: #0058be; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; margin-top: 0; margin-bottom: 24px; text-transform: uppercase;">BudgetFlow</h4>
			<h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Reset your password</h1>
			<p style="font-size: 16px; line-height: 1.6; color: #424754; margin-bottom: 32px;">We've received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.</p>
			
			<a href="%s" style="display: inline-block; background-color: #0058be; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">Reset Password</a>
			
			<p style="font-size: 14px; color: #727785; margin-bottom: 0;">If you didn't request a password reset, you can safely ignore this email.</p>
		</div>
	</body>
	</html>
	`, resetLink)

	return SendEmail([]string{to}, "Reset your BudgetFlow password", body)
}
