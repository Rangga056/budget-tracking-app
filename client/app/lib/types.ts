// ===== Backend API Response Types =====

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  receipt_url: string;
  transaction_date: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
}

// ===== Client Input Types =====

export interface AuthInput {
  email: string;
  password: string;
}

export interface RegisterInput extends AuthInput {
  confirmPassword: string;
}

export interface TransactionInput {
  category_id: string;
  amount: string;
  currency: string;
  description: string;
  receipt_url?: string;
  transaction_date: string;
}

export interface CategoryInput {
  name: string;
  type: 'income' | 'expense';
}

// ===== Offline / IndexedDB Types =====

export interface LocalTransaction extends Omit<Transaction, 'id' | 'user_id' | 'created_at'> {
  localId?: number;
  id?: string;
  synced: boolean;
}

export interface LocalCategory extends Omit<Category, 'id' | 'user_id'> {
  localId?: number;
  id?: string;
  synced: boolean;
}

export interface SyncQueueItem {
  id?: number;
  action: 'create' | 'update' | 'delete';
  table: 'transactions' | 'categories';
  payload: TransactionInput | CategoryInput;
  createdAt: string;
}

// ===== API Response Types =====

export interface ApiResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  errors: string[];
}
