package middleware

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// protected ensures only users with valid JWT token can proceed
func Protected() fiber.Handler {
	return func(c fiber.Ctx) error {
		// retrieve jwt cookie
		cookie := c.Cookies("jwt")
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthenticated"})
		}

		// validate token
		token, err := jwt.Parse(cookie, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthenticated"})
		}

		// extract user id
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthenticated"})
		}

		// store user id in fiber local context
		c.Locals("user_id", claims["issuer"])

		return c.Next()
	}
}
