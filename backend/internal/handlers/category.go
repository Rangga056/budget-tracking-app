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

	var newId string
	var err error

	if input.ID != "" {
		query := `INSERT INTO categories (id, user_id, name, type) VALUES ($1, $2, $3, $4) RETURNING id`
		err = config.DB.QueryRow(context.Background(), query, input.ID, userID, input.Name, input.Type).Scan(&newId)
	} else {
		query := `INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id`
		err = config.DB.QueryRow(context.Background(), query, userID, input.Name, input.Type).Scan(&newId)
	}

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

// UpdateCategory
// @Summary Update an existing category
// @Description Updates a category's name or type
// @Tags Categories
// @Accept json
// @Produce json
// @Param id path string true "Category ID"
// @Param request body models.CategoryInput true "Updated Category Name and Type"
// @Success 200 {object} map[string]string "Category updated successfully"
// @Failure 400 {object} map[string]string "Invalid request"
// @Failure 404 {object} map[string]string "Category not found"
// @Router /api/categories/{id} [put]
func UpdateCategory(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	categoryID := c.Params("id")

	var input models.CategoryInput
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	query := `UPDATE categories SET name = $1, type = $2 WHERE id = $3 AND user_id = $4`
	commandTag, err := config.DB.Exec(context.Background(), query, input.Name, input.Type, categoryID, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update category"})
	}
	if commandTag.RowsAffected() == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Category not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Category updated successfully"})
}

// DeleteCategory
// @Summary Delete a category
// @Description Removes a category belonging to the authenticated user
// @Tags Categories
// @Produce json
// @Param id path string true "Category ID"
// @Success 200 {object} map[string]string "Category deleted successfully"
// @Failure 404 {object} map[string]string "Category not found"
// @Router /api/categories/{id} [delete]
func DeleteCategory(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	categoryID := c.Params("id")

	query := `DELETE FROM categories WHERE id = $1 AND user_id = $2`
	commandTag, err := config.DB.Exec(context.Background(), query, categoryID, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete category"})
	}
	if commandTag.RowsAffected() == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Category not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Category deleted successfully"})
}
