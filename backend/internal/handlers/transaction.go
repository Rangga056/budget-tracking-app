package handlers

import (
	"context"

	"github.com/Rangga056/budget-tracking-app/internal/config"
	"github.com/Rangga056/budget-tracking-app/internal/models"
	"github.com/gofiber/fiber/v3"
)

// CreateTransaction
// @Summary Add a new transaction
// @Description Creates a single transaction. Receipt URL is optional.
// @Tags Transactions
// @Accept json
// @Produce json
// @Param request body models.TransactionInput true "Transaction Data"
// @Success 201 {object} map[string]string "Transaction created"
// @Failure 400,401,500 {object} map[string]string
// @Router /api/transactions [post]
func CreateTransaction(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	var input models.TransactionInput
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// NULLIF($5, '') ensures that if receipt_url is empty
	var newID string
	var err error

	if input.ID != "" {
		query := `
			INSERT INTO transactions (id, user_id, category_id, amount, currency, description, receipt_url, transaction_date) 
			VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), $8) RETURNING id
		`
		err = config.DB.QueryRow(context.Background(), query, input.ID, userID, input.CategoryID, input.Amount, input.Currency, input.Description, input.ReceiptURL, input.TransactionDate).Scan(&newID)
	} else {
		query := `
			INSERT INTO transactions (user_id, category_id, amount, currency, description, receipt_url, transaction_date) 
			VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), $7) RETURNING id
		`
		err = config.DB.QueryRow(context.Background(), query, userID, input.CategoryID, input.Amount, input.Currency, input.Description, input.ReceiptURL, input.TransactionDate).Scan(&newID)
	}

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create transaction"})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Transaction saved",
		"id":      newID,
	})
}

// GetTransactions
// @Summary List user transactions
// @Description Retrieves all transactions for the authenticated user, ordered by date.
// @Tags Transactions
// @Produce json
// @Success 200 {array} models.Transaction
// @Failure 401,500 {object} map[string]string
// @Router /api/transactions [get]
func GetTransactions(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	query := `
		SELECT id, user_id, category_id, amount, currency, description, COALESCE(receipt_url, ''), transaction_date, created_at 
		FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC, created_at DESC
	`

	rows, err := config.DB.Query(context.Background(), query, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch transactions"})
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		// Use Scan() to map the row to struct
		if err := rows.Scan(&t.ID, &t.UserID, &t.CategoryID, &t.Amount, &t.Currency, &t.Description, &t.ReceiptURL, &t.TransactionDate, &t.CreatedAt); err == nil {
			// Clean timestamp format for json output
			t.TransactionDate = t.TransactionDate[:10]
			transactions = append(transactions, t)
		}
	}

	if len(transactions) == 0 {
		return c.JSON([]models.Transaction{})
	}

	return c.JSON(transactions)
}

// SyncTransactions
// @Summary Bulk sync offline transactions
// @Description Processes an array of transactions recorded while the user was offline. Uses a database transaction to ensure all-or-nothing insertion.
// @Tags Transactions
// @Accept json
// @Produce json
// @Param request body models.SyncPayload true "Array of transactions"
// @Success 200 {object} map[string]string "Sync successful"
// @Failure 400,401,500 {object} map[string]string
// @Router /api/sync [post]
func SyncTransactions(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	var payload models.SyncPayload
	if err := c.Bind().Body(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid sync payload"})
	}

	if len(payload.Transactions) == 0 {
		return c.Status(200).JSON(fiber.Map{"message": "No transactions to sync"})
	}

	// Begin database transaction
	tx, err := config.DB.Begin(context.Background())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to start database transaction"})
	}
	defer tx.Rollback(context.Background())

	for _, input := range payload.Transactions {
		if input.ID != "" {
			query := `
				INSERT INTO transactions (id, user_id, category_id, amount, currency, description, receipt_url, transaction_date) 
				VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), $8)
			`
			_, err := tx.Exec(context.Background(), query, input.ID, userID, input.CategoryID, input.Amount, input.Currency, input.Description, input.ReceiptURL, input.TransactionDate)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to sync a transaction"})
			}
		} else {
			query := `
				INSERT INTO transactions (user_id, category_id, amount, currency, description, receipt_url, transaction_date) 
				VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), $7)
			`
			_, err := tx.Exec(context.Background(), query, userID, input.CategoryID, input.Amount, input.Currency, input.Description, input.ReceiptURL, input.TransactionDate)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to sync a transaction"})
			}
		}
	}

	// if loop successful commit change to database
	if err := tx.Commit(context.Background()); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to commit sync"})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Offline sync successful",
		"count":   len(payload.Transactions),
	})
}
