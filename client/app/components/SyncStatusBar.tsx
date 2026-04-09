'use client';

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import { useSyncContext } from './NetworkProvider';

/**
 * Visibility rules:
 * - Online + autoSync enabled  → HIDDEN (syncs silently in background)
 * - Online + autoSync disabled + pending → show "Sync Now" bar
 * - Offline                    → show "Offline" indicator with pending count
 * - Syncing (mid-flight)       → show subtle spinner (autoSync ongoing, brief)
 */
export default function SyncStatusBar() {
  const { isOnline, isSyncing, pendingCount, autoSyncEnabled, syncNow } = useSyncContext();

  // Case 1: Online + autoSync on, and not currently mid-sync → stay quiet
  if (isOnline && autoSyncEnabled && !isSyncing) return null;

  // Case 2: Online + autoSync on + currently syncing → brief subtle indicator
  if (isOnline && autoSyncEnabled && isSyncing) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 3,
          backgroundColor: 'rgba(0, 88, 190, 0.88)',
          backdropFilter: 'blur(16px)',
          color: '#fff',
          boxShadow: '0 6px 24px rgba(19,27,46,0.15)',
        }}
      >
        <CircularProgress size={14} sx={{ color: '#fff' }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Syncing…</Typography>
      </Box>
    );
  }

  // Case 3: Offline — always show
  if (!isOnline) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.25,
          borderRadius: 3,
          backgroundColor: 'rgba(55, 65, 81, 0.94)',
          backdropFilter: 'blur(20px)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(19,27,46,0.2)',
          whiteSpace: 'nowrap',
        }}
      >
        <CloudOffRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
          Offline{pendingCount > 0 ? ` — ${pendingCount} pending` : ''}
        </Typography>
      </Box>
    );
  }

  // Case 4: Online + autoSync DISABLED + have pending items → manual sync prompt
  if (isOnline && !autoSyncEnabled && pendingCount > 0) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.25,
          borderRadius: 3,
          backgroundColor: 'rgba(245, 158, 11, 0.92)',
          backdropFilter: 'blur(20px)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(245,158,11,0.25)',
          whiteSpace: 'nowrap',
        }}
      >
        <SyncRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
          {pendingCount} unsynced
        </Typography>
        <Button
          size="small"
          onClick={syncNow}
          sx={{
            ml: 0.5,
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.6)',
            fontSize: '0.72rem',
            fontWeight: 700,
            py: 0.4,
            px: 1.25,
            minWidth: 'auto',
            borderRadius: 1.5,
            '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.15)' },
          }}
          variant="outlined"
        >
          Sync Now
        </Button>
      </Box>
    );
  }

  // All other cases → hide
  return null;
}
