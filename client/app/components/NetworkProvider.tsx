'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import { useSync } from '../lib/hooks/useSync';

interface SyncContextValue {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: Date | null;
  lastSyncResult: { pushed: number; errors: string[] } | null;
  autoSyncEnabled: boolean;
  syncNow: () => Promise<void>;
  refreshPendingCount: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const syncState = useSync();

  return (
    <SyncContext.Provider value={syncState}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSyncContext must be used within a NetworkProvider');
  }
  return ctx;
}
