'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import { useForm } from '@tanstack/react-form';
import { loginSchema } from '../../lib/validators';
import api from '../../lib/api';

const FEATURES = [
  { icon: DevicesRoundedIcon, text: 'Works offline, syncs when ready' },
  { icon: SecurityRoundedIcon, text: 'Industry-grade encryption' },
  { icon: CloudSyncRoundedIcon, text: 'Real-time sync across devices' },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { usernameOrEmail: '', password: '' },
    onSubmit: async ({ value }) => {
      setServerError('');
      setIsLoading(true);
      try {
        await api.post('/api/login', {
          username_or_email: value.usernameOrEmail,
          password: value.password
        });
        router.push('/dashboard');
      } catch (err: any) {
        setServerError(err.response?.data?.error || err.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#faf8ff',
      }}
    >
      {/* ── Left: Brand Panel (desktop only) ── */}
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
        {/* Decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,88,190,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(33,112,228,0.10) 0%, transparent 70%)',
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

        {/* Main copy */}
        <Box>
          <Typography
            variant="overline"
            sx={{ color: '#0058be', fontSize: '0.6875rem', letterSpacing: '0.18em', mb: 2.5, display: 'block' }}
          >
            PERSONAL FINANCE
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { md: '3.25rem', lg: '4rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              color: '#131b2e',
              letterSpacing: '-0.04em',
              mb: 3,
            }}
          >
            Financial{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(110deg, #0058be 0%, #2170e4 55%, #3d8ef0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Clarity.
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: '1.0625rem',
              color: '#5a6072',
              maxWidth: 380,
              lineHeight: 1.65,
              mb: 5,
            }}
          >
            A pristine workspace for deep thought and financial precision. Track offline, sync when ready.
          </Typography>

          {/* Feature list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {FEATURES.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 88, 190, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <f.icon sx={{ fontSize: 17, color: '#0058be' }} />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#424754', fontWeight: 500 }}>
                  {f.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom tagline */}
        <Typography sx={{ fontSize: '0.75rem', color: '#9ea3b0', fontWeight: 500 }}>
          © 2026 BudgetFlow · Crafted with precision
        </Typography>
      </Box>

      {/* ── Right: Login Form ── */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 460px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 7 },
          py: 6,
          backgroundColor: '#ffffff',
          maxWidth: { xs: '100%', md: 460 },
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

        {/* Heading */}
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
            Welcome{' '}
            <Box component="span" sx={{ color: '#0058be' }}>
              back.
            </Box>
          </Typography>
          <Typography sx={{ color: '#727785', fontSize: '0.9375rem' }}>
            Sign in to your account to continue
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
              name="usernameOrEmail"
              validators={{ onChange: loginSchema.shape.usernameOrEmail }}
            >
              {(field) => (
                <TextField
                  fullWidth
                  label="Username or Email"
                  type="text"
                  placeholder="johndoe or you@example.com"
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

            <Box>
              <form.Field
                name="password"
                validators={{ onChange: loginSchema.shape.password }}
              >
                {(field) => (
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOffRoundedIcon sx={{ fontSize: 20, color: '#727785' }} />
                              ) : (
                                <VisibilityRoundedIcon sx={{ fontSize: 20, color: '#727785' }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </form.Field>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Link
                  href="/auth/forgot-password"
                  style={{
                    color: '#0058be',
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              fullWidth
              endIcon={!isLoading && <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{ mt: 0.5, py: 1.625 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            my: 4,
          }}
        >
          <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(194, 198, 214, 0.4)' }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#9ea3b0', fontWeight: 500 }}>
            or
          </Typography>
          <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(194, 198, 214, 0.4)' }} />
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#727785' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            style={{ color: '#0058be', fontWeight: 700, textDecoration: 'none' }}
          >
            Create one for free
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
