'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import api from '@/app/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid verification link. Token is missing.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/api/verify-email?token=${token}`);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error || err.message || 'Verification failed.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Box sx={{ maxWidth: 480, width: '100%', textAlign: 'center', p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#131b2e', fontWeight: 600 }}>
        Email Verification
      </Typography>

      {status === 'loading' && (
        <Box sx={{ py: 4 }}>
          <CircularProgress size={48} sx={{ color: '#0058be', mb: 3 }} />
          <Typography variant="body1" sx={{ color: '#727785' }}>
            Verifying your email address...
          </Typography>
        </Box>
      )}

      {status === 'success' && (
        <Box>
          <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
            Your email has been successfully verified! You can now access your account.
          </Alert>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/login')}
            fullWidth
            sx={{ py: 1.5, background: 'linear-gradient(135deg, #0058be, #3084f2)' }}
          >
            Sign In to Your Account
          </Button>
        </Box>
      )}

      {status === 'error' && (
        <Box>
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2, textAlign: 'left' }}>
            {errorMessage}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => router.push('/auth/login')}
            fullWidth
            sx={{ py: 1.5, borderColor: '#0058be', color: '#0058be' }}
          >
            Back to Login
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function VerifyEmailPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#faf8ff',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Suspense fallback={
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: '#727785' }}>Initializing verification...</Typography>
        </Box>
      }>
        <VerifyEmailContent />
      </Suspense>
    </Box>
  );
}
