package handlers

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/Rangga056/budget-tracking-app/internal/config"
	"github.com/Rangga056/budget-tracking-app/internal/models"
	"github.com/Rangga056/budget-tracking-app/internal/services"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

// Register handles the creation of a new user account.
// @Summary Register a new user
// @Description Creates a new user account with the provided email and password, hashes the password securely, and stores the record in the PostgreSQL database.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body models.AuthInput true "User registration credentials"
// @Success 201 {object} map[string]string "User registered successfully"
// @Failure 400 {object} map[string]string "Invalid request body"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/register [post]
func Register(c fiber.Ctx) error {
	var input models.AuthInput

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Username == "" || input.Email == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username, email, and password are required"})
	}

	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	verificationToken := uuid.NewString()

	// save to database
	query := `INSERT INTO users (username, email, password_hash, email_verified, verification_token) VALUES ($1, $2, $3, false, $4) RETURNING id`
	var newID string

	err = config.DB.QueryRow(context.Background(), query, input.Username, input.Email, string(hashedPassword), verificationToken).Scan(&newID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Email or Username already exists!"})
	}

	// Send real verification email via SMTP
	go func() {
		if err := services.SendVerificationEmail(input.Email, verificationToken); err != nil {
			fmt.Printf("Failed to send verification email: %v\n", err)
		}
	}()

	return c.Status(201).JSON(fiber.Map{
		"message": "User registered successfully. Please check your email to verify your account.",
		"user_id": newID,
	})
}

// Login
// @Summary Authenticate user
// @Description Verifies credentials and issues a JWT via HttpOnly Cookie
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body models.AuthInput true "Email/Username and Password"
// @Success 200 {object} map[string]string "Login successful"
// @Failure 400 {object} map[string]string "Invalid request body"
// @Failure 401 {object} map[string]string "Incorrect password"
// @Failure 403 {object} map[string]string "Email not verified"
// @Failure 404 {object} map[string]string "User not found"
// @Failure 500 {object} map[string]string "Database error"
// @Router /api/login [post]
func Login(c fiber.Ctx) error {
	var input models.AuthInput

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	identifier := input.UsernameOrEmail
	if identifier == "" {
		identifier = input.Email // Fallback for old clients
	}

	var user struct {
		ID            string
		PasswordHash  string
		EmailVerified bool
	}
	query := `SELECT id, password_hash, email_verified FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)`

	err := config.DB.QueryRow(context.Background(), query, identifier).Scan(&user.ID, &user.PasswordHash, &user.EmailVerified)
	if err == pgx.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	} else if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Block if email is not verified
	if !user.EmailVerified {
		return c.Status(403).JSON(fiber.Map{"error": "Please verify your email before logging in."})
	}

	// verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Incorrect password"})
	}

	// generate jwt
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"issuer": user.ID,
		"exp":    time.Now().Add(time.Hour * 24 * 7).Unix(),
	})
	secret := os.Getenv("JWT_SECRET")
	token, err := claims.SignedString([]byte(secret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not login"})
	}

	// store token in HttpOnly
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24 * 7),
		HTTPOnly: true,
		Secure:   false, // Set to true if using HTTPS in production
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{"message": "Login successful"})
}

// Logout
// @Summary End user session
// @Description Removes the JWT from the Cookie
// @Tags Authentication
// @Produce json
// @Success 200 {object} map[string]string "Logout successful"
// @Router /api/logout [post]
func Logout(c fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), // Expire in the past
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{"message": "Logout successful"})
}

// VerifyEmail
// @Summary Verify email address
// @Description Verifies a user's email address using a token sent to their email
// @Tags Authentication
// @Produce json
// @Param token query string true "Verification Token"
// @Success 200 {object} map[string]string "Email verified successfully!"
// @Failure 400 {object} map[string]string "Invalid or expired verification token"
// @Failure 500 {object} map[string]string "Database error"
// @Router /api/verify-email [get]
func VerifyEmail(c fiber.Ctx) error {
	token := c.Query("token")
	if token == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Verification token is required"})
	}

	query := `UPDATE users SET email_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id`
	var id string
	err := config.DB.QueryRow(context.Background(), query, token).Scan(&id)
	
	if err == pgx.ErrNoRows {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid or expired verification token"})
	} else if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(fiber.Map{"message": "Email verified successfully!"})
}

// ForgotPassword
// @Summary Request password reset
// @Description Initiates the password reset flow. Sends mock email.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body map[string]string true "Username or Email (key: username_or_email)"
// @Success 200 {object} map[string]string "Password reset link sent (if account exists)"
// @Failure 400 {object} map[string]string "Invalid request body"
// @Failure 500 {object} map[string]string "Database error"
// @Router /api/forgot-password [post]
func ForgotPassword(c fiber.Ctx) error {
	var input struct {
		UsernameOrEmail string `json:"username_or_email"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	resetToken := uuid.NewString()
	expires := time.Now().Add(1 * time.Hour)

	query := `UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 OR username = $3 RETURNING email`
	var userEmail string
	err := config.DB.QueryRow(context.Background(), query, resetToken, expires, input.UsernameOrEmail).Scan(&userEmail)
	
	if err == pgx.ErrNoRows {
		// Do not leak if user exists or not
		return c.JSON(fiber.Map{"message": "If an account with that email/username exists, a password reset link has been sent."})
	} else if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Send real password reset email via SMTP
	go func() {
		if err := services.SendPasswordResetEmail(userEmail, resetToken); err != nil {
			fmt.Printf("Failed to send password reset email: %v\n", err)
		}
	}()

	return c.JSON(fiber.Map{"message": "If an account with that email/username exists, a password reset link has been sent."})
}

// ResetPassword
// @Summary Reset password
// @Description Sets a new password using a reset token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body map[string]string true "Token and NewPassword"
// @Success 200 {object} map[string]string "Password updated successfully"
// @Failure 400 {object} map[string]string "Invalid request body or expired token"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/reset-password [post]
func ResetPassword(c fiber.Ctx) error {
	var input struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Token == "" || input.NewPassword == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Token and new password are required"})
	}

	// check token validity
	var id string
	var expires time.Time
	err := config.DB.QueryRow(context.Background(), `SELECT id, reset_password_expires FROM users WHERE reset_password_token = $1`, input.Token).Scan(&id, &expires)
	
	if err == pgx.ErrNoRows {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid or expired reset token"})
	} else if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if time.Now().After(expires) {
		return c.Status(400).JSON(fiber.Map{"error": "Reset token has expired"})
	}

	// hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), 14)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to handle new password"})
	}

	// update db
	updateQuery := `UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2`
	_, err = config.DB.Exec(context.Background(), updateQuery, string(hashedPassword), id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update password"})
	}

	return c.JSON(fiber.Map{"message": "Password has been successfully updated"})
}
