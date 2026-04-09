import { z } from 'zod';

// ===== Auth Schemas =====

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, 'Username or Email is required')
    .min(3, 'Must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmNewPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

// ===== Transaction Schema =====
export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  currency: z
    .string()
    .min(1, 'Currency is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description too long'),
  category_id: z
    .string()
    .min(1, 'Please select a category'),
  transaction_date: z
    .string()
    .min(1, 'Date is required'),
  receipt_url: z
    .string()
    .url('Enter a valid URL')
    .optional()
    .or(z.literal('')),
  type: z.enum(['income', 'expense']),
});

// ===== Category Schema =====

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Name too long'),
  type: z.enum(['income', 'expense'], {
    message: 'Select income or expense',
  }),
});

// ===== Inferred Types =====

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
