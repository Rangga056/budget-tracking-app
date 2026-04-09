package models

import "time"

// User table
type User struct {
	ID                   string     `json:"id"`
	Username             *string    `json:"username"`
	Email                string     `json:"email"`
	PasswordHash         string     `json:"-"`
	EmailVerified        bool       `json:"email_verified"`
	VerificationToken    *string    `json:"-"`
	ResetPasswordToken   *string    `json:"-"`
	ResetPasswordExpires *time.Time `json:"-"`
	CreatedAt            time.Time  `json:"created_at"`
}

// AuthInput represent json payload
type AuthInput struct {
	Username        string `json:"username,omitempty"`
	Email           string `json:"email,omitempty"`
	Password        string `json:"password"`
	UsernameOrEmail string `json:"username_or_email,omitempty"`
}
