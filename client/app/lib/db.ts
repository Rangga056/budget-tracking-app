import api from './api';
import Dexie, { type Table } from 'dexie';

// ===== IndexedDB Record Types =====

export interface DBTransaction {
  localId?: number;
  serverId?: string;
  categoryId: string;
  amount: number;
  currency: string;
  description: string;
  receiptUrl: string;
  transactionDate: string;
  createdAt: string;
  synced: boolean;
}

export interface DBPreference {
  key: string;
  value: any;
}

export interface DBCategory {
  localId?: number;
  serverId?: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;   // e.g. 'ShoppingCart', 'Restaurant'
  color?: string;  // e.g. '#b90538'
  synced: boolean;
}

export interface DBSyncQueueItem {
  id?: number;
  action: 'create' | 'update' | 'delete';
  table: 'transactions' | 'categories';
  payload: string; // JSON stringified
  createdAt: string;
}

// ===== Database Definition =====

// Define the database using the functional approach which is more robust in TS/Next.js
export const db = new Dexie('BudgetTrackerDB') as Dexie & {
  transactions: Table<DBTransaction, number>;
  categories: Table<DBCategory, number>;
  syncQueue: Table<DBSyncQueueItem, number>;
  preferences: Table<DBPreference, string>;
};

// Define schema
db.version(2).stores({
  transactions: '++localId, serverId, categoryId, transactionDate, synced',
  categories: '++localId, serverId, name, type, synced',
  syncQueue: '++id, table, createdAt',
  preferences: 'key',
});

// Version 3: add icon and color fields to categories (non-indexed, no migration needed)
db.version(3).stores({
  transactions: '++localId, serverId, categoryId, transactionDate, synced',
  categories: '++localId, serverId, name, type, synced',
  syncQueue: '++id, table, createdAt',
  preferences: 'key',
});

// ===== Helper Functions =====

/** Get a preference by key */
export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
  const pref = await db.preferences.get(key);
  return pref ? pref.value : defaultValue;
}

/** Set a preference */
export async function setPreference(key: string, value: any) {
  await db.preferences.put({ key, value });
}

/** Add a transaction locally and queue for sync */
export async function addLocalTransaction(data: Omit<DBTransaction, 'localId' | 'synced' | 'createdAt' | 'serverId'>) {
  const now = new Date().toISOString();
  // Generate random UUID to establish offline-first relationship stability
  const generatedId = crypto.randomUUID();

  const localId = await db.transactions.add({
    ...data,
    serverId: generatedId,
    createdAt: now,
    synced: false,
  });

  await db.syncQueue.add({
    action: 'create',
    table: 'transactions',
    payload: JSON.stringify({
      id: generatedId,
      category_id: data.categoryId,
      amount: String(data.amount),
      currency: data.currency,
      description: data.description,
      receipt_url: data.receiptUrl,
      transaction_date: data.transactionDate,
    }),
    createdAt: now,
  });

  return localId;
}

/** 
 * Online-First Transaction Save: 
 * Tries server first if online, falls back to IndexedDB + Sync Queue.
 */
export async function saveTransaction(data: Omit<DBTransaction, 'localId' | 'synced' | 'createdAt' | 'serverId'>) {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (isOnline) {
    try {
      const generatedId = crypto.randomUUID();
      const payload = {
        id: generatedId,
        category_id: data.categoryId,
        amount: String(data.amount),
        currency: data.currency,
        description: data.description,
        receipt_url: data.receiptUrl,
        transaction_date: data.transactionDate,
      };

      await api.post('/api/sync', { transactions: [payload] });

      // Save to local DB as synced
      return await db.transactions.add({
        ...data,
        serverId: generatedId,
        createdAt: new Date().toISOString(),
        synced: true,
      });
    } catch (err) {
      console.warn('Online save failed, falling back to offline mode:', err);
    }
  }

  // Fallback to offline
  return await addLocalTransaction(data);
}

/** Add a category locally and queue for sync */
export async function addLocalCategory(data: Omit<DBCategory, 'localId' | 'synced' | 'serverId'>) {
  const generatedId = crypto.randomUUID();

  const localId = await db.categories.add({
    ...data,
    serverId: generatedId,
    synced: false,
  });

  await db.syncQueue.add({
    action: 'create',
    table: 'categories',
    payload: JSON.stringify({
      id: generatedId,
      name: data.name,
      type: data.type,
      icon: data.icon,
      color: data.color,
    }),
    createdAt: new Date().toISOString(),
  });

  return localId;
}

/** 
 * Online-First Category Save:
 * Tries server first if online, falls back to IndexedDB + Sync Queue.
 */
export async function saveCategory(data: Omit<DBCategory, 'localId' | 'synced' | 'serverId'>) {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (isOnline) {
    try {
      const generatedId = crypto.randomUUID();
      const payload = {
        id: generatedId,
        name: data.name,
        type: data.type,
      };

      await api.post('/api/categories', payload);

      // Save to local DB as synced
      return await db.categories.add({
        ...data,
        serverId: generatedId,
        synced: true,
      });
    } catch (err) {
      console.warn('Category online save failed, falling back to offline:', err);
    }
  }

  // Fallback to offline
  return await addLocalCategory(data);
}

/** Update a category locally and queue for sync */
export async function updateLocalCategory(serverId: string, data: Partial<Omit<DBCategory, 'localId' | 'synced' | 'serverId'>>) {
  const category = await db.categories.where('serverId').equals(serverId).first();
  if (!category) throw new Error('Category not found locally');

  await db.categories.update(category.localId!, { ...data, synced: false });

  await db.syncQueue.add({
    action: 'update',
    table: 'categories',
    payload: JSON.stringify({ id: serverId, ...data }),
    createdAt: new Date().toISOString(),
  });
}

/** Delete a category locally and queue for sync */
export async function deleteLocalCategory(serverId: string) {
  const category = await db.categories.where('serverId').equals(serverId).first();
  if (!category) throw new Error('Category not found locally');

  await db.categories.delete(category.localId!);

  await db.syncQueue.add({
    action: 'delete',
    table: 'categories',
    payload: JSON.stringify({ id: serverId }),
    createdAt: new Date().toISOString(),
  });
}

/** Get pending sync count */
export async function getPendingSyncCount(): Promise<number> {
  return db.syncQueue.count();
}

/**
 * Robustly merge server data into local IndexedDB without wiping pending changes.
 */
export async function upsertFromServer(
  transactions: Array<{ id: string; category_id: string; amount: number; currency: string; description: string; receipt_url: string; transaction_date: string; created_at: string }>,
  categories: Array<{ id: string; name: string; type: 'income' | 'expense' }>
) {
  await db.transaction('rw', [db.transactions, db.categories], async () => {
    // 1. Process Categories
    const serverCatIds = new Set(categories.map(c => c.id));
    
    // Remove local synced categories that are no longer on server
    const localSyncedCats = await db.categories.where('synced').equals(1).toArray();
    for (const cat of localSyncedCats) {
      if (cat.serverId && !serverCatIds.has(cat.serverId)) {
        await db.categories.delete(cat.localId!);
      }
    }

    // Upsert server categories
    for (const c of categories) {
      const existing = await db.categories.where('serverId').equals(c.id).first();
      if (existing) {
        await db.categories.update(existing.localId!, {
          name: c.name,
          type: c.type,
          synced: true
        });
      } else {
        await db.categories.add({
          serverId: c.id,
          name: c.name,
          type: c.type,
          synced: true
        });
      }
    }

    // 2. Process Transactions
    const serverTxIds = new Set(transactions.map(t => t.id));

    // Remove local synced transactions that are no longer on server
    const localSyncedTx = await db.transactions.where('synced').equals(1).toArray();
    for (const tx of localSyncedTx) {
      if (tx.serverId && !serverTxIds.has(tx.serverId)) {
        await db.transactions.delete(tx.localId!);
      }
    }

    // Upsert server transactions
    for (const t of transactions) {
      const existing = await db.transactions.where('serverId').equals(t.id).first();
      if (existing) {
        await db.transactions.update(existing.localId!, {
          categoryId: t.category_id,
          amount: t.amount,
          currency: t.currency || 'IDR',
          description: t.description,
          receiptUrl: t.receipt_url,
          transactionDate: t.transaction_date,
          createdAt: t.created_at,
          synced: true
        });
      } else {
        await db.transactions.add({
          serverId: t.id,
          categoryId: t.category_id,
          amount: t.amount,
          currency: t.currency || 'IDR',
          description: t.description,
          receiptUrl: t.receipt_url,
          transactionDate: t.transaction_date,
          createdAt: t.created_at,
          synced: true
        });
      }
    }
  });
}
