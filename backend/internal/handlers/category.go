package handlers

import (
	"context"

	"github.com/Rangga056/budget-tracking-app/internal/config"
	"github.com/Rangga056/budget-tracking-app/internal/models"
	"github.com/gofiber/fiber/v3"
)

// CreateCategory
// @Summary Create a new category
// @Description Creates a new income or expense category for the authenticated user
// @Tags Categories
// @Accept json
// @Produce json
// @Param request body models.CategoryInput true "Category Name and Type"
// @Success 201 {object} models.Category "Category created successfully"
// @Failure 400 {object} map[string]string "Invalid request body or type"
// @Failure 401 {object} map[string]string "Unauthenticated"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/categories [post]
func CreateCategory(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	var input models.CategoryInput
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Type != "income" && input.Type == "expense" {
		return c.Status(400).JSON(fiber.Map{"error": "Type must be 'income' or 'expense'"})
	}

	query := `INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id`

	var newId string
	err := config.DB.QueryRow(context.Background(), query, userID, input.Name, input.Type).Scan(&newId)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create category"})
	}

	return c.Status(201).JSON(models.Category{
		ID:     newId,
		UserID: userID,
		Name:   input.Name,
		Type:   input.Type,
	})
}

// GetCategories
// @Summary Get user categories
// @Description Retrieves all categories belonging to the authenticated user
// @Tags Categories
// @Produce json
// @Success 200 {array} models.Category "List of categories"
// @Failure 401 {object} map[string]string "Unauthenticated"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/categories [get]
func GetCategories(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	query := `SELECT id, user_id, name, type FROM categories WHERE user_id = $1`
	rows, err := config.DB.Query(context.Background(), query, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch categories"})
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var cat models.Category
		if err := rows.Scan(&cat.ID, &cat.UserID, &cat.Name, &cat.Type); err == nil {
			categories = append(categories, cat)
		}
	}

	// return empty array
	if len(categories) == 0 {
		return c.JSON([]models.Category{})
	}

	return c.JSON(categories)
}
