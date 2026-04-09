'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import api from './lib/api';
import LoadingScreen from './components/LoadingScreen';

const FEATURES = [
  {
    title: 'Offline First',
    desc: 'Your data stays with you. Work seamlessly even without an internet connection.',
    icon: DevicesRoundedIcon,
    color: '#0058be',
    bg: 'rgba(0, 88, 190, 0.08)',
    number: '01',
  },
  {
    title: 'Real-time Sync',
    desc: 'Your budget is always up to date across all your devices as soon as you are online.',
    icon: CloudSyncRoundedIcon,
    color: '#006c49',
    bg: 'rgba(0, 108, 73, 0.08)',
    number: '02',
  },
  {
    title: 'Private & Secure',
    desc: 'Industry-standard encryption ensures your financial data stays private.',
    icon: SecurityRoundedIcon,
    color: '#b90538',
    bg: 'rgba(185, 5, 56, 0.08)',
    number: '03',
  },
];

const STEPS = [
  { step: '1', title: 'Create your account', desc: 'Sign up in seconds — no credit card required.' },
  { step: '2', title: 'Add transactions', desc: 'Log income and expenses with your preferred currency.' },
  { step: '3', title: 'Gain clarity', desc: 'See your financial picture through elegant dashboards.' },
];

const MOCK_TRANSACTIONS = [
  { label: 'Salary', sub: 'Work income', val: '+$3,200', positive: true },
  { label: 'Groceries', sub: 'Daily needs', val: '-$124', positive: false },
  { label: 'Freelance', sub: 'Side project', val: '+$850', positive: true },
];

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get('/api/me');
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  if (isLoggedIn === null) return <LoadingScreen />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf8ff', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: { xs: 12, md: 16 },
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 1180,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
          py: { xs: 1.25, md: 1.5 },
          borderRadius: '16px',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.78)',
          boxShadow: '0 1px 0 rgba(194, 198, 214, 0.45), 0 8px 32px rgba(19, 31, 46, 0.07)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(0, 88, 190, 0.22)',
            }}
          >
            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.9375rem',
              letterSpacing: '-0.02em',
              color: '#131b2e',
            }}
          >
            BudgetFlow
          </Typography>
        </Box>

        {/* Nav actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isLoggedIn ? (
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              size="small"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="text"
                onClick={() => router.push('/auth/login')}
                sx={{
                  color: '#424754',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/register')}
                size="small"
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ── Hero ── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 18, md: 24 }, pb: { xs: 10, md: 16 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Overline badge */}
            <Box
              className="animate-fade-up-1"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.625,
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 88, 190, 0.08)',
                border: '1px solid rgba(0, 88, 190, 0.15)',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#0058be',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <Typography
                sx={{
                  color: '#0058be',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  fontSize: '0.6875rem',
                }}
              >
                PERSONAL FINANCE — OFFLINE FIRST
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              className="animate-fade-up-2"
              sx={{
                fontSize: { xs: '3rem', sm: '3.75rem', md: '4.75rem' },
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

            {/* Body */}
            <Typography
              className="animate-fade-up-3"
              sx={{
                fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                color: '#727785',
                maxWidth: 460,
                mb: 6,
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              A pristine digital workspace for deep thought and financial precision.
              Track, analyze, and own your budget — anywhere, anytime.
            </Typography>

            {/* CTAs */}
            <Box className="animate-fade-up-4" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push(isLoggedIn ? '/dashboard' : '/auth/register')}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ minWidth: 180 }}
              >
                {isLoggedIn ? 'Open Dashboard' : 'Start Free'}
              </Button>
              {!isLoggedIn && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/auth/login')}
                  sx={{
                    borderColor: 'rgba(19, 27, 46, 0.18)',
                    color: '#424754',
                    '&:hover': {
                      borderColor: 'rgba(19, 27, 46, 0.32)',
                      backgroundColor: 'rgba(19, 27, 46, 0.02)',
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>

            {/* Social proof */}
            <Box
              className="animate-fade-up-4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4 }}
            >
              <Box sx={{ display: 'flex' }}>
                {['#0058be', '#006c49', '#b90538'].map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${c}, ${c}aa)`,
                      border: '2px solid #faf8ff',
                      ml: i > 0 ? -1 : 0,
                    }}
                  />
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: '#727785', fontWeight: 500 }}>
                Trusted by thousands of users worldwide
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            {/* Hero visual — mock ledger card */}
            <Box className="animate-scale-in" sx={{ position: 'relative' }}>
              {/* Shadow card (depth layer) */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  top: 20,
                  left: 20,
                  borderRadius: '28px',
                  background: 'linear-gradient(135deg, rgba(0,88,190,0.1) 0%, rgba(33,112,228,0.06) 100%)',
                  filter: 'blur(2px)',
                }}
              />
              {/* Main card */}
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '28px',
                  background: 'linear-gradient(145deg, #0058be 0%, #1565cc 50%, #2170e4 100%)',
                  p: { xs: 3.5, md: 4 },
                  color: '#fff',
                  boxShadow: '0 32px 64px rgba(0, 88, 190, 0.24), 0 8px 24px rgba(0, 88, 190, 0.16)',
                  overflow: 'hidden',
                  animation: 'float 5s ease-in-out infinite',
                }}
              >
                {/* Card shimmer overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -80,
                    right: -80,
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -60,
                    left: -40,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Card header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3.5 }}>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.625rem', fontWeight: 700, opacity: 0.55, letterSpacing: '0.12em', mb: 0.75 }}
                    >
                      TOTAL BALANCE
                    </Typography>
                    <Typography
                      sx={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      $4,250.00
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>

                {/* Mini stat row */}
                <Box sx={{ display: 'flex', gap: 3, mb: 3.5 }}>
                  {[
                    { label: 'Income', val: '+$6,400', color: '#6cf8bb', icon: TrendingUpRoundedIcon },
                    { label: 'Expenses', val: '-$2,150', color: '#ffa3a3', icon: TrendingDownRoundedIcon },
                  ].map((s) => (
                    <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <s.icon sx={{ fontSize: 14, color: s.color, opacity: 0.8 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.625rem', opacity: 0.5, letterSpacing: '0.06em', mb: 0.2 }}>
                          {s.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: s.color }}>
                          {s.val}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Divider */}
                <Box sx={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                {/* Transaction rows */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {MOCK_TRANSACTIONS.map((row, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.07)',
                        borderRadius: '12px',
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            backgroundColor: row.positive ? 'rgba(108, 248, 187, 0.15)' : 'rgba(255, 163, 163, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {row.positive
                            ? <TrendingUpRoundedIcon sx={{ fontSize: 14, color: '#6cf8bb' }} />
                            : <TrendingDownRoundedIcon sx={{ fontSize: 14, color: '#ffa3a3' }} />
                          }
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2 }}>
                            {row.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.625rem', opacity: 0.45 }}>{row.sub}</Typography>
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          color: row.positive ? '#6cf8bb' : '#ffa3a3',
                        }}
                      >
                        {row.val}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Floating glass chip — savings */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  px: 2,
                  py: 1.25,
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
                  display: { xs: 'none', md: 'block' },
                  border: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#006c49', mb: 0.1 }}>
                  ↑ 12% savings
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: '#9ea3b0', fontWeight: 500 }}>
                  vs last month
                </Typography>
              </Box>

              {/* Floating glass chip — offline */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -16,
                  left: -16,
                  px: 1.5,
                  py: 1,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 0.75,
                  border: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#006c49',
                    boxShadow: '0 0 0 2px rgba(0, 108, 73, 0.2)',
                  }}
                />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#131b2e' }}>
                  Offline Mode
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── How It Works ── */}
      <Box sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 8, md: 12 }, maxWidth: 540 }}>
            <Typography
              variant="overline"
              sx={{ color: '#0058be', display: 'block', mb: 2, letterSpacing: '0.15em' }}
            >
              HOW IT WORKS
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 900,
                color: '#131b2e',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Start in{' '}
              <Box component="span" sx={{ color: '#0058be' }}>
                three steps.
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 0, md: 0 },
              position: 'relative',
            }}
          >
            {/* Connector line on desktop */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 28,
                left: '12.5%',
                right: '12.5%',
                height: '1px',
                backgroundColor: 'rgba(0, 88, 190, 0.15)',
                zIndex: 0,
              }}
            />

            {STEPS.map((step, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'flex-start', md: 'flex-start' },
                  gap: { xs: 2, md: 0 },
                  pl: { xs: 0, md: i === 0 ? 0 : 5 },
                  pr: { xs: 0, md: i === STEPS.length - 1 ? 0 : 5 },
                  pb: { xs: i < STEPS.length - 1 ? 4 : 0, md: 0 },
                  borderBottom: { xs: i < STEPS.length - 1 ? '1px solid rgba(194, 198, 214, 0.25)' : 'none', md: 'none' },
                  mb: { xs: i < STEPS.length - 1 ? 4 : 0, md: 0 },
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '18px',
                    backgroundColor: 'rgba(0, 88, 190, 0.07)',
                    border: '1px solid rgba(0, 88, 190, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mb: { md: 4 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.125rem',
                      fontWeight: 900,
                      color: '#0058be',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.step}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      color: '#131b2e',
                      mb: 0.75,
                      letterSpacing: '-0.01em',
                      mt: { md: 0 },
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: '#727785', lineHeight: 1.65, fontSize: '0.9375rem' }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Features ── */}
      <Box sx={{ backgroundColor: '#ffffff', py: { xs: 12, md: 18 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography
              variant="overline"
              sx={{ color: '#0058be', display: 'block', mb: 2, letterSpacing: '0.15em' }}
            >
              WHY BUDGETFLOW
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 900,
                color: '#131b2e',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                maxWidth: 500,
              }}
            >
              Built for{' '}
              <Box component="span" sx={{ color: '#0058be' }}>
                precision.
              </Box>
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box
                  sx={{
                    p: { xs: 3.5, md: 4 },
                    borderRadius: '24px',
                    backgroundColor: '#faf8ff',
                    height: '100%',
                    cursor: 'default',
                    transition: 'box-shadow 250ms ease, transform 250ms ease, background-color 250ms ease',
                    border: '1px solid rgba(194, 198, 214, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: '#f4f6ff',
                      boxShadow: '0 12px 40px rgba(19,27,46,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Number watermark */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: 'rgba(194, 198, 214, 0.25)',
                      lineHeight: 1,
                      userSelect: 'none',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {f.number}
                  </Typography>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      backgroundColor: f.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                      mb: 3,
                    }}
                  >
                    <f.icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.0625rem',
                      mb: 1.5,
                      color: '#131b2e',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography sx={{ color: '#727785', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ── */}
      <Box sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 5, md: 8 },
              borderRadius: '32px',
              background: 'linear-gradient(145deg, #0058be 0%, #1565cc 50%, #2170e4 100%)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0, 88, 190, 0.22)',
            }}
          >
            {/* Orbs */}
            <Box
              sx={{
                position: 'absolute',
                top: -80,
                right: -80,
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -60,
                left: -40,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                opacity: 0.65,
                mb: 2,
              }}
            >
              START TODAY — IT'S FREE
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                mb: 2,
              }}
            >
              Take control of your finances.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                opacity: 0.75,
                mb: 5,
                maxWidth: 480,
                mx: 'auto',
                lineHeight: 1.65,
              }}
            >
              Join thousands who use BudgetFlow to track their money and build a clearer financial future.
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              onClick={() => router.push(isLoggedIn ? '/dashboard' : '/auth/register')}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                backgroundColor: '#ffffff',
                color: '#0058be',
                fontWeight: 800,
                px: 4,
                py: 1.75,
                fontSize: '0.9375rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                '&:hover': {
                  backgroundColor: '#f0f4ff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
                  color: '#0046a0',
                },
              }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid rgba(194, 198, 214, 0.25)',
          py: 5,
          px: { xs: 3, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 13, color: '#fff' }} />
              </Box>
              <Typography
                sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#131b2e', letterSpacing: '-0.01em' }}
              >
                BudgetFlow
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, flexWrap: 'wrap' }}>
              {['Dashboard', 'Sign In', 'Register'].map((item) => (
                <Typography
                  key={item}
                  component={Link}
                  href={item === 'Dashboard' ? '/dashboard' : `/auth/${item.toLowerCase().replace(' ', '-')}`}
                  sx={{
                    fontSize: '0.8125rem',
                    color: '#727785',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { color: '#131b2e' },
                    transition: 'color 0.15s ease',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>

            <Typography sx={{ fontSize: '0.8125rem', color: '#9ea3b0' }}>
              © 2026 BudgetFlow. Crafted with precision.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
