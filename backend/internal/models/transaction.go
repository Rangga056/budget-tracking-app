package models

import "time"

// @Represent the transaction table
type Transaction struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	CategoryID      string    `json:"category_id"`
	Amount          float64   `json:"amount"`
	Currency        string    `json:"currency"`
	Description     string    `json:"description"`
	ReceiptURL      string    `json:"receipt_url"`
	TransactionDate string    `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
}

// Represent the payload sent from client
type TransactionInput struct {
	ID              string `json:"id"`
	CategoryID      string `json:"category_id"`
	Amount          string `json:"amount"`
	Currency        string `json:"currency"`
	Description     string `json:"description"`
	ReceiptURL      string `json:"receipt_url"`
	TransactionDate string `json:"transaction_date"`
}

// Represent an array of transactions sent during offline to online recovery
type SyncPayload struct {
	Transactions []TransactionInput `json:"transacctions"`
}
