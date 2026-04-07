package models

// @Represent the categories table
type Category struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	Name   string `json:"name"`
	Type   string `json:"type"`
}

// @Represent JSON payload
type CategoryInput struct {
	Name string `json:"name"`
	Type string `json:"type"`
}
