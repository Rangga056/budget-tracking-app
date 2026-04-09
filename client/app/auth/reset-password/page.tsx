'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { resetPasswordSchema } from '../../lib/validators';
import api from '../../lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { newPassword: '', confirmNewPassword: '' },
    onSubmit: async ({ value }: { value: any }) => {
      setServerError('');
      setSuccessMessage('');

      if (!token) {
        setServerError('Invalid or missing reset token.');
        return;
      }

      const result = resetPasswordSchema.safeParse(value);
      if (!result.success) {
        setServerError(result.error.issues[0]?.message || 'Validation failed');
        return;
      }

      setIsLoading(true);
      try {
        await api.post('/api/reset-password', {
          token,
          new_password: value.newPassword,
        });
        setSuccessMessage('Your password has been successfully reset.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (err: any) {
        setServerError(err.response?.data?.error || err.message || 'Failed to reset password');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 440 }}>
      {/* Success state */}
      {successMessage ? (
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 108, 73, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32, color: '#006c49' }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              color: '#131b2e',
              letterSpacing: '-0.03em',
              mb: 1,
            }}
          >
            Password Reset!
          </Typography>
          <Typography sx={{ color: '#727785', fontSize: '0.9375rem', mb: 3 }}>
            {successMessage}
          </Typography>
          <Alert
            severity="success"
            sx={{ borderRadius: '12px', textAlign: 'left', fontSize: '0.875rem' }}
          >
            Redirecting you to login...
          </Alert>
          <Box sx={{ mt: 4 }}>
            <Link href="/auth/login" style={{ color: '#0058be', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
              Go to Login →
            </Link>
          </Box>
        </Box>
      ) : (
        <>
          {/* Heading */}
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.25rem' },
              color: '#131b2e',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Create new{' '}
            <Box component="span" sx={{ color: '#0058be' }}>
              password.
            </Box>
          </Typography>
          <Typography sx={{ color: '#727785', fontSize: '0.9375rem', mb: 4 }}>
            Choose a strong password you haven't used before.
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.875rem' }}>
              {serverError}
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <form.Field name="newPassword">
                {(field: any) => (
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: '#c2c6d6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword
                                ? <VisibilityOffRoundedIcon sx={{ fontSize: 20, color: '#727785' }} />
                                : <VisibilityRoundedIcon sx={{ fontSize: 20, color: '#727785' }} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </form.Field>

              <form.Field name="confirmNewPassword">
                {(field: any) => (
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: '#c2c6d6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </form.Field>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !token}
                fullWidth
                sx={{ py: 1.625, mt: 0.5 }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link
              href="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#727785',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              ← Back to Sign In
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#faf8ff',
      }}
    >
      {/* Left decorative panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: { md: 7, lg: 10 },
          py: 8,
          background: 'linear-gradient(160deg, #eef1ff 0%, #dce5ff 45%, #c8d5ff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,88,190,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(0, 88, 190, 0.28)',
            }}
          >
            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#131b2e', letterSpacing: '-0.02em' }}>
            BudgetFlow
          </Typography>
        </Box>

        {/* Middle content */}
        <Box>
          <Typography
            variant="overline"
            sx={{ color: '#0058be', fontSize: '0.6875rem', letterSpacing: '0.18em', mb: 2.5, display: 'block' }}
          >
            ACCOUNT SECURITY
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { md: '2.75rem', lg: '3.5rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              color: '#131b2e',
              letterSpacing: '-0.04em',
              mb: 3,
            }}
          >
            Secure your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(110deg, #0058be 0%, #2170e4 55%, #3d8ef0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              account.
            </Box>
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: '#5a6072', maxWidth: 360, lineHeight: 1.65 }}>
            Choose a strong, unique password to keep your financial data safe and secure.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#9ea3b0', fontWeight: 500 }}>
          © 2026 BudgetFlow
        </Typography>
      </Box>

      {/* Right: Form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 460px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 7 },
          py: 6,
          backgroundColor: '#ffffff',
          boxShadow: { md: '-1px 0 0 rgba(194, 198, 214, 0.35)' },
        }}
      >
        {/* Mobile brand */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 7 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#131b2e', letterSpacing: '-0.02em' }}>
            BudgetFlow
          </Typography>
        </Box>

        <Suspense
          fallback={
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={36} sx={{ color: '#0058be' }} />
              <Typography sx={{ color: '#727785', fontSize: '0.875rem' }}>
                Initializing secure session...
              </Typography>
            </Box>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </Box>
    </Box>
  );
}
