'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fullSync } from '../sync';
import { getPendingSyncCount } from '../db';
import { useNetwork } from './useNetwork';

const POLL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

export function useSync() {
  const { isOnline, wasOffline, clearWasOffline } = useNetwork();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<{ pushed: number; errors: string[] } | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true); // default true = online-first
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const hasSyncedOnLoad = useRef(false);

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingSyncCount();
      setPendingCount(count);
    } catch {
      // IndexedDB not available (SSR)
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const { getPreference } = await import('../db');
      const enabled = await getPreference('autoSync', true);
      setAutoSyncEnabled(enabled);
    } catch {
      // SSR
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    try {
      const result = await fullSync();
      setLastSyncTime(new Date());
      setLastSyncResult({ pushed: result.pushed, errors: result.errors });
      await refreshPendingCount();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline, refreshPendingCount]);

  // Sync immediately on first load when online + autoSync enabled
  useEffect(() => {
    if (isOnline && autoSyncEnabled && !hasSyncedOnLoad.current) {
      hasSyncedOnLoad.current = true;
      // Small delay to let DB hydrate first
      const t = setTimeout(() => syncNow(), 1500);
      return () => clearTimeout(t);
    }
  }, [isOnline, autoSyncEnabled, syncNow]);

  // Auto-sync when coming back online after being offline
  useEffect(() => {
    if (wasOffline && isOnline && autoSyncEnabled) {
      clearWasOffline();
      syncNow();
    }
  }, [wasOffline, isOnline, autoSyncEnabled, clearWasOffline, syncNow]);

  // Background poll when online + autoSync enabled
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    if (isOnline && autoSyncEnabled) {
      pollRef.current = setInterval(() => syncNow(), POLL_INTERVAL_MS);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOnline, autoSyncEnabled, syncNow]);

  // Initial loads
  useEffect(() => {
    refreshPendingCount();
    refreshSettings();
  }, [refreshPendingCount, refreshSettings]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    lastSyncResult,
    autoSyncEnabled,
    syncNow,
    refreshPendingCount,
  };
}
