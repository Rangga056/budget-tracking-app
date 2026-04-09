'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useForm } from '@tanstack/react-form';
import { forgotPasswordSchema } from '../../lib/validators';
import api from '../../lib/api';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      setServerError('');
      setSuccessMessage('');
      const result = forgotPasswordSchema.safeParse(value);
      if (!result.success) {
        setServerError(result.error.issues[0]?.message || 'Validation failed');
        return;
      }
      setIsLoading(true);
      try {
        await api.post('/api/forgot-password', { username_or_email: value.email });
        setSuccessMessage("If an account with that email exists, we've sent a password reset link.");
      } catch (err: any) {
        setServerError(err.response?.data?.error || err.message || 'Failed to process request');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: '#faf8ff' }}>

      {/* ── Left: Brand Panel ── */}
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
            ACCOUNT RECOVERY
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { md: '2.75rem', lg: '3.5rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              color: '#131b2e',
              letterSpacing: '-0.04em',
              mb: 3,
            }}
          >
            Recover your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(110deg, #0058be 0%, #2170e4 55%, #3d8ef0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              access.
            </Box>
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: '#5a6072', maxWidth: 360, lineHeight: 1.65 }}>
            We'll send a secure link to your email so you can reset your password quickly.
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#9ea3b0', fontWeight: 500 }}>
          © 2026 BudgetFlow
        </Typography>
      </Box>

      {/* ── Right: Form ── */}
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
        {/* Mobile logo */}
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

        {successMessage ? (
          /* ── Success state ── */
          <Box sx={{ maxWidth: 380 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '18px',
                backgroundColor: 'rgba(0, 88, 190, 0.09)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <MailOutlineRoundedIcon sx={{ fontSize: 28, color: '#0058be' }} />
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
              Check your inbox.
            </Typography>
            <Typography sx={{ color: '#727785', fontSize: '0.9375rem', mb: 4, lineHeight: 1.65 }}>
              {successMessage}
            </Typography>
            <Alert severity="success" sx={{ borderRadius: '12px', fontSize: '0.875rem', mb: 4 }}>
              Didn't receive an email? Check your spam folder.
            </Alert>
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
        ) : (
          /* ── Form state ── */
          <Box sx={{ maxWidth: 380, width: '100%' }}>
            <Box sx={{ mb: 5 }}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.375rem' },
                  color: '#131b2e',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                Forgot{' '}
                <Box component="span" sx={{ color: '#0058be' }}>
                  password?
                </Box>
              </Typography>
              <Typography sx={{ color: '#727785', fontSize: '0.9375rem' }}>
                Enter your email — we'll send you a reset link.
              </Typography>
            </Box>

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
                <form.Field
                  name="email"
                  validators={{ onChange: forgotPasswordSchema.shape.email }}
                >
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors.length > 0}
                      helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailRoundedIcon sx={{ color: '#c2c6d6', fontSize: 20 }} />
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
                  disabled={isLoading}
                  fullWidth
                  endIcon={!isLoading && <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                  sx={{ py: 1.625 }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Link
                href="/auth/login"
                style={{
                  color: '#727785',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                ← Back to Sign In
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
