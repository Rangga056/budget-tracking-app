package handlers

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

// UploadReceipt
// @Summary Upload a transaction receipt
// @Description Uploads an image file to the local server and returns the accessible URL.
// @Tags Uploads
// @Accept multipart/form-data
// @Produce json
// @Param receipt formData file true "Receipt Image (JPEG/PNG)"
// @Success 200 {object} map[string]string "Returns the receipt_url"
// @Failure 400 {object} map[string]string "Invalid file type or request"
// @Failure 401 {object} map[string]string "Unauthenticated"
// @Failure 500 {object} map[string]string "Failed to save image"
// @Router /api/upload [post]
func UploadReceipt(c fiber.Ctx) error {
	// Parse multipart from file
	file, err := c.FormFile("receipt")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Failed to retrieve file from request"})
	}

	// Validate file type
	contentType := file.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		return c.Status(400).JSON(fiber.Map{"error": "Only image files are allowed"})
	}

	// Generate a secure unique filename
	extension := filepath.Ext(file.Filename)
	uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), extension)

	// Define filepath
	savePath := fmt.Sprintf("./uploads/receipts/%s", uniqueFilename)

	// Save file
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save image to server"})
	}

	// Construct imageURL
	fileURL := fmt.Sprintf("%s/uploads/receipts/%s", c.BaseURL(), uniqueFilename)

	return c.Status(200).JSON(fiber.Map{
		"message":     "Upload successful",
		"receipt_url": fileURL,
	})
}
