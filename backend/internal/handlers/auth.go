package handlers

import (
	"context"
	"os"
	"time"

	"github.com/Rangga056/budget-tracking-app/internal/config"
	"github.com/Rangga056/budget-tracking-app/internal/models"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

// Register handles the creation of a new user account.
// @Summary Register a new user
// @Description Creates a new user account with the provided email and password, hashes the password securely, and stores the record in the PostgreSQL database.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body models.AuthInput true "User registration credentials (email and password)"
// @Success 201 {object} map[string]string "User registered successfully"
// @Failure 400 {object} map[string]string "Invalid request body"
// @Failure 500 {object} map[string]string "Internal server error or email already exists"
// @Router /api/register [post]
func Register(c fiber.Ctx) error {
	var input models.AuthInput

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	// save to database
	query := `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`
	var newID string

	err = config.DB.QueryRow(context.Background(), query, input.Email, string(hashedPassword)).Scan(&newID)
	if err != nil {
	        return c.Status(500).JSON(fiber.Map{"error": "Email already exists or database error"})
	}

	return c.Status(201).JSON(fiber.Map{
	        "message": "User registered successfully",
	        "user_id": newID,
	})
	}

	// Login
	// @Summary Authenticate user
	// @Description Verifies credentials and issues a JWT via HttpOnly Cookie
	// @Tags Authentication
	// @Accept json
	// @Produce json
	// @Param request body models.AuthInput true "Email and Password"
	// @Success 200 {object} map[string]string "Login successful"
	// @Failure 400 {object} map[string]string "Invalid request body"
	// @Failure 401 {object} map[string]string "Incorrect password"
	// @Failure 404 {object} map[string]string "User not found"
	// @Failure 500 {object} map[string]string "Database or server error"
	// @Router /api/login [post]
	func Login(c fiber.Ctx) error {
	var input models.AuthInput

	if err := c.Bind().Body(&input); err != nil {
	        return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	query := `SELECT id, email, password_hash FROM users WHERE email = $1`

	err := config.DB.QueryRow(context.Background(), query, input.Email).Scan(&user.ID, &user.Email, &user.PasswordHash)
	if err == pgx.ErrNoRows {
	        return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	} else if err != nil {
	        return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
	        return c.Status(401).JSON(fiber.Map{"error": "Incorrect password"})
	}

	// generate jwt
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	        "issuer": user.ID,
	        "exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
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
		SameSite: "Strict",
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
