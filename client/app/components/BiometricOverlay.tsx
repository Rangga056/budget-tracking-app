'use client';

import { Box, Typography, IconButton, CircularProgress, Backdrop } from '@mui/material';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import { useState, useEffect } from 'react';

interface BiometricOverlayProps {
  onSuccess: () => void;
  isFingerprint?: boolean;
}

export default function BiometricOverlay({ onSuccess, isFingerprint = true }: BiometricOverlayProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setError(false);
    
    // Simulate biometric scan delay
    setTimeout(() => {
      setScanning(false);
      onSuccess();
    }, 1500);
  };

  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: 2000,
        backgroundColor: '#faf8ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: '#727785', mb: 4 }}>
          Please verify your identity to access your financial ledger.
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {scanning && (
          <CircularProgress
            size={84}
            thickness={2}
            sx={{
              position: 'absolute',
              top: -10,
              left: -10,
              color: '#0058be',
            }}
          />
        )}
        <IconButton
          onClick={handleScan}
          disabled={scanning}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: 'rgba(0, 88, 190, 0.08)',
            color: '#0058be',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 88, 190, 0.15)',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFingerprint ? (
            <FingerprintRoundedIcon sx={{ fontSize: 40 }} />
          ) : (
            <FaceRoundedIcon sx={{ fontSize: 40 }} />
          )}
        </IconButton>
      </Box>

      <Typography
        variant="button"
        onClick={handleScan}
        sx={{
          mt: 4,
          color: '#0058be',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          fontSize: '0.75rem',
        }}
      >
        {scanning ? 'SCANNING...' : 'TAP TO SCAN'}
      </Typography>
    </Backdrop>
  );
}
