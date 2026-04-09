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
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useForm } from '@tanstack/react-form';
import { registerSchema } from '../../lib/validators';
import api from '../../lib/api';

const PERKS = [
  'No credit card required',
  'Works fully offline',
  'Free forever, no hidden fees',
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const form = useForm({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setServerError('');
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        setServerError(result.error.issues[0]?.message || 'Validation failed');
        return;
      }
      setIsLoading(true);
      try {
        await api.post('/api/register', {
          username: value.username,
          email: value.email,
          password: value.password,
        });
        setIsRegistered(true);
      } catch (err: any) {
        setServerError(err.response?.data?.error || err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isRegistered) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf8ff',
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
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
              fontSize: '1.75rem',
              color: '#131b2e',
              letterSpacing: '-0.03em',
              mb: 1,
            }}
          >
            Account created!
          </Typography>
          <Typography sx={{ color: '#727785', fontSize: '0.9375rem', mb: 4, lineHeight: 1.65 }}>
            Please check your email for the verification link. Once verified, you can sign in.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/login')}
            endIcon={<ArrowForwardRoundedIcon />}
            fullWidth
            sx={{ py: 1.625 }}
          >
            Go to Sign In
          </Button>
        </Box>
      </Box>
    );
  }

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
            GET STARTED
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
            Start your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(110deg, #0058be 0%, #2170e4 55%, #3d8ef0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              journey.
            </Box>
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: '#5a6072', maxWidth: 380, lineHeight: 1.65, mb: 5 }}>
            Create your account and begin tracking your finances with clarity and precision.
          </Typography>

          {/* Perks list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {PERKS.map((perk, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 108, 73, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: '#006c49' }} />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#424754', fontWeight: 500 }}>
                  {perk}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#9ea3b0', fontWeight: 500 }}>
          © 2026 BudgetFlow · Crafted with precision
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
            Create{' '}
            <Box component="span" sx={{ color: '#0058be' }}>
              account.
            </Box>
          </Typography>
          <Typography sx={{ color: '#727785', fontSize: '0.9375rem' }}>
            Set up your free account in seconds
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.875rem' }}>
            {serverError}
          </Alert>
        )}

        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <form.Field
              name="username"
              validators={{ onChange: registerSchema.innerType().shape.username }}
            >
              {(field) => (
                <TextField
                  fullWidth
                  label="Username"
                  type="text"
                  placeholder="johndoe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon sx={{ color: '#c2c6d6', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: registerSchema.innerType().shape.email }}
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

            <form.Field
              name="password"
              validators={{ onChange: registerSchema.innerType().shape.password }}
            >
              {(field) => (
                <TextField
                  fullWidth
                  label="Password"
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

            <form.Field
              name="confirmPassword"
              validators={{ onChange: registerSchema.innerType().shape.confirmPassword }}
            >
              {(field) => (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
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
              disabled={isLoading}
              fullWidth
              endIcon={!isLoading && <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{ mt: 0.5, py: 1.625 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Box>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#727785' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#0058be', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
