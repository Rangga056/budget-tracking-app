'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  IconButton,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getPreference, setPreference } from '../../lib/db';
import { useSyncContext } from '../../components/NetworkProvider';
import type { DBTransaction, DBCategory } from '../../lib/db';

const EXCHANGE_RATES: Record<string, number> = {
  IDR: 1,
  USD: 15800,
  EUR: 17200,
  SGD: 11800,
};

// --- Helpers ---
const COLORS = ['#0058be', '#006c49', '#b90538', '#f59e0b', '#7c3aed', '#db2777'];

function formatCurrency(n: number, currency: string) {
  const locales: Record<string, string> = { IDR: 'id-ID', USD: 'en-US', EUR: 'de-DE', SGD: 'en-SG' };
  return new Intl.NumberFormat(locales[currency] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    notation: Math.abs(n) >= 1_000_000_000 ? 'compact' : 'standard',
  }).format(n);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Category icon map from db
const getIconBg = (idx: number) => COLORS[idx % COLORS.length];

function StatCard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <Card
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 8px rgba(19,27,46,0.06)',
        borderRadius: '16px',
        border: '1px solid rgba(194, 198, 214, 0.2)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '9px',
              backgroundColor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: '#9ea3b0', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.1em' }}
          >
            {label}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.0625rem', md: '1.25rem' },
            color,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isOnline } = useSyncContext();
  const [displayCurrency, setDisplayCurrency] = useState('IDR');

  const transactions = useLiveQuery(
    () => db.transactions.orderBy('transactionDate').reverse().toArray()
  ) as DBTransaction[] | undefined;

  const categories = useLiveQuery(
    () => db.categories.toArray()
  ) as DBCategory[] | undefined;

  const loading = transactions === undefined || categories === undefined;

  useEffect(() => {
    getPreference('displayCurrency', 'IDR').then(setDisplayCurrency);
  }, []);

  const handleCurrencyChange = async (val: string) => {
    setDisplayCurrency(val);
    await setPreference('displayCurrency', val);
  };

  const convert = (amount: number, from: string) => {
    if (from === displayCurrency) return amount;
    return (amount * (EXCHANGE_RATES[from] || 1)) / (EXCHANGE_RATES[displayCurrency] || 1);
  };

  const summary = useMemo(() => {
    if (!transactions) return { income: 0, expense: 0, balance: 0 };
    let income = 0, expense = 0;
    transactions.forEach((t) => {
      const v = convert(t.amount, t.currency || 'IDR');
      if (t.amount > 0) income += v;
      else expense += Math.abs(v);
    });
    return { income, expense, balance: income - expense };
  }, [transactions, displayCurrency]);

  const chartData = useMemo(() => {
    if (!transactions) return [];
    const grouped = new Map<string, { income: number; expense: number }>();
    transactions.slice(0, 30).forEach((t) => {
      const date = t.transactionDate.slice(0, 10);
      const prev = grouped.get(date) || { income: 0, expense: 0 };
      const v = convert(t.amount, t.currency || 'IDR');
      if (t.amount > 0) prev.income += v;
      else prev.expense += Math.abs(v);
      grouped.set(date, prev);
    });
    return Array.from(grouped.entries())
      .map(([date, val]) => ({ date: formatDate(date), ...val }))
      .slice(0, 7)
      .reverse();
  }, [transactions, displayCurrency]);

  // Top spending categories (expenses)
  const topCategories = useMemo(() => {
    if (!transactions || !categories) return [];
    const grouped = new Map<string, { name: string; color: string; value: number }>();
    transactions.filter((t) => t.amount < 0).forEach((t) => {
      const cat = categories.find((c) => c.serverId === t.categoryId);
      const name = cat?.name || 'Uncategorized';
      const color = cat?.color || '#b90538';
      const v = Math.abs(convert(t.amount, t.currency || 'IDR'));
      const prev = grouped.get(name) || { name, color, value: 0 };
      prev.value += v;
      grouped.set(name, prev);
    });
    return Array.from(grouped.values()).sort((a, b) => b.value - a.value).slice(0, 4);
  }, [transactions, categories, displayCurrency]);

  // Top income sources
  const topIncomeSources = useMemo(() => {
    if (!transactions || !categories) return [];
    const grouped = new Map<string, { name: string; color: string; value: number }>();
    transactions.filter((t) => t.amount > 0).forEach((t) => {
      const cat = categories.find((c) => c.serverId === t.categoryId);
      const name = cat?.name || 'Other Income';
      const color = cat?.color || '#006c49';
      const v = convert(t.amount, t.currency || 'IDR');
      const prev = grouped.get(name) || { name, color, value: 0 };
      prev.value += v;
      grouped.set(name, prev);
    });
    return Array.from(grouped.values()).sort((a, b) => b.value - a.value).slice(0, 4);
  }, [transactions, categories, displayCurrency]);

  const catMap = useMemo(() => {
    const m = new Map<string, DBCategory>();
    (categories || []).forEach((c) => { if (c.serverId) m.set(c.serverId, c); });
    return m;
  }, [categories]);

  const recent = transactions?.slice(0, 8) ?? [];

  // --- Loading state ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Skeleton variant="rounded" height={156} sx={{ borderRadius: '20px' }} />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Skeleton variant="rounded" height={96} sx={{ flex: 1, borderRadius: '16px' }} />
          <Skeleton variant="rounded" height={96} sx={{ flex: 1, borderRadius: '16px' }} />
        </Box>
        <Skeleton variant="rounded" height={220} sx={{ borderRadius: '20px' }} />
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: '20px' }} />
      </Box>
    );
  }

  const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>

      {/* ── Hero Balance Card ── */}
      <Box
        sx={{
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #0058be 0%, #1564cc 40%, #2170e4 100%)',
          p: { xs: 2.5, md: 3 },
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 88, 190, 0.22)',
        }}
      >
        {/* decorative orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: 40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box>
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                opacity: 0.65,
                mb: 0.75,
              }}
            >
              TOTAL BALANCE
            </Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '2.75rem' },
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {formatCurrency(summary.balance, displayCurrency)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <FormControl variant="standard" size="small">
              <Select
                value={displayCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                disableUnderline
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '0.8rem',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  px: 1.25,
                  py: 0.4,
                  borderRadius: '8px',
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiSelect-select': { py: 0 },
                }}
              >
                {['IDR', 'USD', 'EUR', 'SGD'].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Online status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: isOnline ? '#6cf8bb' : '#f59e0b',
                  boxShadow: isOnline ? '0 0 0 2px rgba(108, 248, 187, 0.3)' : 'none',
                }}
              />
              <Typography sx={{ fontSize: '0.65rem', opacity: 0.75, fontWeight: 600 }}>
                {isOnline ? 'Synced' : 'Offline'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Savings rate chip */}
        {summary.income > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: '8px',
                backgroundColor: savingsRate >= 0 ? 'rgba(108, 248, 187, 0.2)' : 'rgba(255, 163, 163, 0.2)',
                border: `1px solid ${savingsRate >= 0 ? 'rgba(108, 248, 187, 0.3)' : 'rgba(255, 163, 163, 0.3)'}`,
              }}
            >
              <TrendingUpRoundedIcon sx={{ fontSize: 13, color: savingsRate >= 0 ? '#6cf8bb' : '#ffa3a3' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: savingsRate >= 0 ? '#6cf8bb' : '#ffa3a3' }}>
                {savingsRate}% savings rate
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Income / Expense Cards ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <StatCard
          label="TOTAL INCOME"
          value={formatCurrency(summary.income, displayCurrency)}
          icon={<TrendingUpRoundedIcon sx={{ color: '#006c49', fontSize: 16 }} />}
          color="#006c49"
          bgColor="rgba(0, 108, 73, 0.1)"
        />
        <StatCard
          label="TOTAL EXPENSES"
          value={formatCurrency(summary.expense, displayCurrency)}
          icon={<TrendingDownRoundedIcon sx={{ color: '#b90538', fontSize: 16 }} />}
          color="#b90538"
          bgColor="rgba(185, 5, 56, 0.1)"
        />
      </Box>

      {/* ── Spending Analysis Chart ── */}
      {chartData.length > 0 && (
        <Card
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 1px 8px rgba(19,27,46,0.06)',
            border: '1px solid rgba(194, 198, 214, 0.2)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.95rem', md: '1.0625rem' },
                    color: '#131b2e',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Spending Analysis
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ea3b0' }}>
                  Daily breakdown · {displayCurrency}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {[{ color: '#006c49', label: 'Income' }, { color: '#b90538', label: 'Expense' }].map((l) => (
                  <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: l.color }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#727785', fontWeight: 600 }}>{l.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b90538" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#b90538" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(19,27,46,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9ea3b0' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    border: '1px solid rgba(194,198,214,0.3)',
                    boxShadow: '0 4px 20px rgba(19,27,46,0.12)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  formatter={(v: number) => [formatCurrency(v, displayCurrency)]}
                />
                <Area type="monotone" dataKey="income" stroke="#006c49" strokeWidth={2} fill="url(#ig)" dot={false} />
                <Area type="monotone" dataKey="expense" stroke="#b90538" strokeWidth={2} fill="url(#eg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Category Breakdowns ── */}
      {(topCategories.length > 0 || topIncomeSources.length > 0) && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>

          {/* Expense breakdown */}
          {topCategories.length > 0 && (
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 1px 8px rgba(19,27,46,0.06)',
                border: '1px solid rgba(194, 198, 214, 0.2)',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#b90538',
                      flexShrink: 0,
                      boxShadow: '0 0 0 3px rgba(185, 5, 56, 0.12)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.9375rem',
                      color: '#131b2e',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Top Expenses
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topCategories.map((cat) => {
                    const pct = summary.expense > 0 ? (cat.value / summary.expense) * 100 : 0;
                    return (
                      <Box key={cat.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: cat.color,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: '#131b2e',
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cat.name}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: cat.color }}>
                            {formatCurrency(cat.value, displayCurrency)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(pct, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 4,
                            backgroundColor: `${cat.color}18`,
                            '& .MuiLinearProgress-bar': { backgroundColor: cat.color, borderRadius: 4 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Income breakdown */}
          {topIncomeSources.length > 0 && (
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 1px 8px rgba(19,27,46,0.06)',
                border: '1px solid rgba(194, 198, 214, 0.2)',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#006c49',
                      flexShrink: 0,
                      boxShadow: '0 0 0 3px rgba(0, 108, 73, 0.12)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.9375rem',
                      color: '#131b2e',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Income Sources
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topIncomeSources.map((src) => {
                    const pct = summary.income > 0 ? (src.value / summary.income) * 100 : 0;
                    return (
                      <Box key={src.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: src.color,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: '#131b2e',
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {src.name}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: src.color }}>
                            +{formatCurrency(src.value, displayCurrency)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(pct, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 4,
                            backgroundColor: `${src.color}18`,
                            '& .MuiLinearProgress-bar': { backgroundColor: src.color, borderRadius: 4 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* ── Recent Transactions ── */}
      <Card
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 1px 8px rgba(19,27,46,0.06)',
          border: '1px solid rgba(194, 198, 214, 0.2)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.95rem', md: '1.0625rem' },
                color: '#131b2e',
                letterSpacing: '-0.02em',
              }}
            >
              Recent Transactions
            </Typography>
            <Box
              onClick={() => router.push('/transactions')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: '#0058be',
                '&:hover': { opacity: 0.7 },
                transition: 'opacity 0.15s ease',
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.01em' }}>
                See all
              </Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>

          {recent.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  backgroundColor: 'rgba(194, 198, 214, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 28, color: '#c2c6d6' }} />
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#424754', mb: 0.5 }}>
                No transactions yet
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ea3b0' }}>
                Tap + to add your first one
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {recent.map((t, i) => {
                const cat = t.categoryId ? catMap.get(t.categoryId) : undefined;
                const isPositive = t.amount > 0;
                const iconColor = cat?.color || (isPositive ? '#006c49' : '#b90538');
                return (
                  <Box
                    key={t.localId || i}
                    onClick={() => router.push('/transactions')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.25,
                      cursor: 'pointer',
                      borderBottom: i < recent.length - 1 ? '1px solid rgba(194,198,214,0.12)' : 'none',
                      '&:hover': {
                        '& .tx-icon': { transform: 'scale(1.05)' },
                        '& .tx-title': { color: '#0058be' },
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Category icon */}
                    <Box
                      className="tx-icon"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '13px',
                        flexShrink: 0,
                        backgroundColor: `${iconColor}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      {isPositive
                        ? <TrendingUpRoundedIcon sx={{ fontSize: 18, color: iconColor }} />
                        : <TrendingDownRoundedIcon sx={{ fontSize: 18, color: iconColor }} />
                      }
                    </Box>

                    {/* Description + meta */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        className="tx-title"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#131b2e',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'color 0.15s ease',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {t.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#9ea3b0' }}>
                          {formatDate(t.transactionDate)}
                        </Typography>
                        {cat && (
                          <>
                            <Box sx={{ width: 2, height: 2, borderRadius: '50%', backgroundColor: '#c2c6d6' }} />
                            <Box
                              sx={{
                                px: 0.75,
                                py: 0.2,
                                borderRadius: '5px',
                                backgroundColor: `${cat.color}14`,
                              }}
                            >
                              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: cat.color }}>
                                {cat.name}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Amount + sync */}
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: isPositive ? '#006c49' : '#b90538',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {isPositive ? '+' : ''}{formatCurrency(t.amount, t.currency || 'IDR')}
                      </Typography>
                      {!t.synced && (
                        <Typography
                          sx={{
                            fontSize: '0.58rem',
                            color: '#f59e0b',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                          }}
                        >
                          PENDING
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
