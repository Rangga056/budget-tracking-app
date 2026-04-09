import api from './api';
import { db, upsertFromServer } from './db';
import type { SyncResult, TransactionInput } from './types';
import type { DBSyncQueueItem, DBCategory } from './db';

/**
 * Push all pending items from the sync queue to the server.
 * Uses POST /api/sync for transactions (bulk).
 * Uses POST /api/categories for categories (one-by-one).
 */
export async function pushPendingChanges(): Promise<{ pushed: number; errors: string[] }> {
  const queueItems = await db.syncQueue.toArray();
  let pushed = 0;
  const errors: string[] = [];

  if (queueItems.length === 0) {
    return { pushed: 0, errors: [] };
  }

  // Group by table
  const transactionItems = queueItems.filter((q: DBSyncQueueItem) => q.table === 'transactions');
  const categoryItems = queueItems.filter((q: DBSyncQueueItem) => q.table === 'categories');

  // Sync transactions in bulk via POST /api/sync
  if (transactionItems.length > 0) {
    try {
      const transactions: TransactionInput[] = transactionItems.map((q: DBSyncQueueItem) => JSON.parse(q.payload));

      await api.post('/api/sync', { transactions });

      // Remove synced items from queue
      const ids = transactionItems.map((q: DBSyncQueueItem) => q.id!);
      await db.syncQueue.bulkDelete(ids);

      // Mark local transactions as synced
      await db.transactions.where('synced').equals(0).modify({ synced: true });

      pushed += transactionItems.length;
    } catch (err: any) {
      if (err.status && err.status >= 400) {
        // Server rejected payload explicitly, purge from sync queue
        const ids = transactionItems.map((q: DBSyncQueueItem) => q.id!);
        await db.syncQueue.bulkDelete(ids);
        await db.transactions.where('synced').equals(0).modify({ synced: true });
      }
      errors.push(`Failed to sync ${transactionItems.length} transactions: ${err.message || err}`);
    }
  }

  // Sync categories one by one via mapping action to HTTP rules
  for (const item of categoryItems) {
    try {
      const payload = JSON.parse(item.payload);
      
      if (item.action === 'create') {
        await api.post('/api/categories', payload);
      } else if (item.action === 'update') {
        await api.put(`/api/categories/${payload.id}`, payload);
      } else if (item.action === 'delete') {
        await api.delete(`/api/categories/${payload.id}`);
      }

      await db.syncQueue.delete(item.id!);

      if (item.action !== 'delete') {
        // Mark matching local category as synced
        await db.categories
          .where('serverId')
          .equals(payload.id)
          .modify({ synced: true });
      }

      pushed++;
    } catch (err: any) {
      if (err.status && err.status >= 400) {
        // Purge rejected category from queue
        await db.syncQueue.delete(item.id!);
        const payload = JSON.parse(item.payload);
        await db.categories
          .where('serverId')
          .equals(payload.id)
          .modify({ synced: true });
      }
      errors.push(`Failed to sync category "${JSON.parse(item.payload).name}": ${err.message || err}`);
    }
  }

  return { pushed, errors };
}

/**
 * Pull latest data from server and populate IndexedDB.
 */
export async function pullServerData(): Promise<{ pulled: number }> {
  try {
    const [transactions, categories] = await Promise.all([
      api.get<Array<{ id: string; category_id: string; amount: number; currency: string; description: string; receipt_url: string; transaction_date: string; created_at: string }>>('/api/transactions'),
      api.get<Array<{ id: string; name: string; type: 'income' | 'expense' }>>('/api/categories'),
    ]);

    const txns = transactions || [];
    const cats = categories || [];

    await upsertFromServer(txns, cats);

    return { pulled: txns.length + cats.length };
  } catch (err) {
    console.error('Failed to pull server data:', err);
    return { pulled: 0 };
  }
}

/**
 * Full sync: push pending changes, then pull fresh data.
 */
export async function fullSync(): Promise<SyncResult> {
  const pushResult = await pushPendingChanges();
  const pullResult = await pullServerData();

  return {
    pushed: pushResult.pushed,
    pulled: pullResult.pulled,
    errors: pushResult.errors,
  };
}
