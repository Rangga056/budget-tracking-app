package models

import "time"

// User table
type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

// AuthInput represent json payload
type AuthInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
