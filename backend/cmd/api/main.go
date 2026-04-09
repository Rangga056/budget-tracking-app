package main

import (
	"log"
	"os"

	"github.com/Rangga056/budget-tracking-app/internal/config"
	"github.com/Rangga056/budget-tracking-app/internal/handlers"
	"github.com/Rangga056/budget-tracking-app/internal/middleware"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

// @title Budget Tracking App
// @version 1.0
// @host localhost:8000

func main() {
	// initialize db connection
	config.ConnectDB()
	defer config.CloseDB()

	app := fiber.New(fiber.Config{
		AppName: "Budget Tracking App API v1.0",
	})

	// middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowCredentials: true,
	}))

	// swagger ui
	app.Get("/swagger.json", func(c fiber.Ctx) error {
		return c.SendFile("./docs/swagger.json")
	})

	app.Get("/swagger", func(c fiber.Ctx) error {
		c.Set("Content-Type", "text/html")
		return c.SendString(`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Swagger UI - Budget Tracker</title>
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css" >
				<style>html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; } *, *:before, *:after { box-sizing: inherit; } body { margin:0; background: #fafafa; }</style>
			</head>
			<body>
				<div id="swagger-ui"></div>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js"> </script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js"> </script>
				<script>
				window.onload = function() {
					window.ui = SwaggerUIBundle({
						url: "/swagger.json",
						dom_id: '#swagger-ui',
						deepLinking: true,
						presets: [ SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset ],
						layout: "StandaloneLayout",
						requestInterceptor: function(request) {
							request.credentials = 'same-origin';
							return request;
						}
					})
				}
				</script>
			</body>
			</html>
			`)
	})

	// routes
	app.Get("/health", func(c fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "success",
			"message": "API is up and running",
			"db":      "connected",
		})
	})

	// API Routes
	api := app.Group("/api")

	// Auth Routes (public)
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)
	api.Get("/verify-email", handlers.VerifyEmail)
	api.Post("/forgot-password", handlers.ForgotPassword)
	api.Post("/reset-password", handlers.ResetPassword)

	// Protected Routes
	protected := api.Group("", middleware.Protected())

	protected.Get("/me", middleware.Protected(), func(c fiber.Ctx) error {
		userID := c.Locals("user_id")
		return c.JSON(fiber.Map{
			"message": "You have successfully accessed a protected route",
			"user_id": userID,
		})
	})

	// Category Routes
	protected.Post("/categories", handlers.CreateCategory)
	protected.Get("/categories", handlers.GetCategories)
	protected.Put("/categories/:id", handlers.UpdateCategory)
	protected.Delete("/categories/:id", handlers.DeleteCategory)

	// Transaction Routes
	protected.Post("/transactions", handlers.CreateTransaction)
	protected.Get("/transactions", handlers.GetTransactions)

	// Bulk Sync Route
	protected.Post("/sync", handlers.SyncTransactions)

	// Upload Route
	protected.Post("/upload", handlers.UploadReceipt)

	// start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Fatal(app.Listen(":" + port))
}
