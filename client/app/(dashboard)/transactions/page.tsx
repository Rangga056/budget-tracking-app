'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Skeleton,
  Chip,
  Button,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { db } from '../../lib/db';
import type { DBTransaction, DBCategory } from '../../lib/db';

const TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
] as const;

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<DBTransaction[]>([]);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    async function load() {
      const txns = await db.transactions.orderBy('transactionDate').reverse().toArray();
      const cats = await db.categories.toArray();
      setTransactions(txns);
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const catMap = useMemo(() => {
    const map = new Map<string, DBCategory>();
    categories.forEach((c) => { if (c.serverId) map.set(c.serverId, c); });
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType === 'income' && t.amount < 0) return false;
      if (filterType === 'expense' && t.amount > 0) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, filterType]);

  const grouped = useMemo(() => {
    const groups = new Map<string, DBTransaction[]>();
    filtered.forEach((t) => {
      const date = t.transactionDate.slice(0, 10);
      const arr = groups.get(date) || [];
      arr.push(t);
      groups.set(date, arr);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  const formatCurrency = (n: number, currency: string) => {
    const locales: Record<string, string> = { IDR: 'id-ID', USD: 'en-US', EUR: 'de-DE', SGD: 'en-SG' };
    return new Intl.NumberFormat(locales[currency] || 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(n);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rounded" height={52} sx={{ borderRadius: '16px' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: '16px' }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Page Header ── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: '#0058be', display: 'block', mb: 0.5, letterSpacing: '0.15em', fontSize: '0.6875rem' }}
          >
            HISTORY
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: '#131b2e',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Transactions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => router.push('/transactions/new')}
          sx={{ flexShrink: 0 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* ── Filters Bar ── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search transactions..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 180 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#c2c6d6', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Type pill tabs */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {TYPE_FILTERS.map((f) => (
            <Box
              key={f.value}
              onClick={() => setFilterType(f.value)}
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: '10px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: filterType === f.value ? '#0058be' : 'transparent',
                color: filterType === f.value ? '#fff' : '#727785',
                border: '1px solid',
                borderColor: filterType === f.value ? '#0058be' : 'rgba(194, 198, 214, 0.5)',
                '&:hover': {
                  borderColor: filterType === f.value ? '#0058be' : '#c2c6d6',
                  color: filterType === f.value ? '#fff' : '#424754',
                },
              }}
            >
              {f.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Transaction List ── */}
      {grouped.length === 0 ? (
        <Box
          sx={{
            py: 12,
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(194, 198, 214, 0.2)',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '18px',
              backgroundColor: 'rgba(0, 88, 190, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <ReceiptLongRoundedIcon sx={{ fontSize: 26, color: '#c2c6d6' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#424754', mb: 0.5 }}>
            No transactions found
          </Typography>
          <Typography sx={{ color: '#9ea3b0', fontSize: '0.875rem' }}>
            {search ? 'Try a different search term' : 'Add your first transaction to get started'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {grouped.map(([date, items]) => (
            <Box key={date}>
              {/* Date header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#9ea3b0',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  {formatDate(date)}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(194, 198, 214, 0.25)' }} />
              </Box>

              {/* Card */}
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid rgba(194, 198, 214, 0.18)',
                  overflow: 'hidden',
                }}
              >
                {items.map((t, i) => {
                  const cat = catMap.get(t.categoryId);
                  const isPositive = t.amount > 0;
                  return (
                    <Box
                      key={t.localId || i}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2.5,
                        py: 1.75,
                        borderBottom: i < items.length - 1 ? '1px solid rgba(194, 198, 214, 0.12)' : 'none',
                        transition: 'background-color 0.15s ease',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f7f8fc' },
                      }}
                    >
                      {/* Left */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                        {/* Category icon */}
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '13px',
                            backgroundColor: isPositive
                              ? 'rgba(0, 108, 73, 0.09)'
                              : 'rgba(185, 5, 56, 0.09)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isPositive
                            ? <TrendingUpRoundedIcon sx={{ fontSize: 19, color: '#006c49' }} />
                            : <TrendingDownRoundedIcon sx={{ fontSize: 19, color: '#b90538' }} />
                          }
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              color: '#131b2e',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {t.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.4 }}>
                            {cat && (
                              <Chip
                                label={cat.name}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.6rem',
                                  fontWeight: 600,
                                  backgroundColor: cat.type === 'income'
                                    ? 'rgba(0, 108, 73, 0.08)'
                                    : 'rgba(185, 5, 56, 0.08)',
                                  color: cat.type === 'income' ? '#006c49' : '#b90538',
                                  borderRadius: '5px',
                                }}
                              />
                            )}
                            <Typography sx={{ fontSize: '0.6875rem', color: '#c2c6d6', fontWeight: 500 }}>
                              {t.currency || 'IDR'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Right */}
                      <Box sx={{ textAlign: 'right', ml: 2, flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.9375rem',
                            color: isPositive ? '#006c49' : '#b90538',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {isPositive ? '+' : ''}{formatCurrency(t.amount, t.currency || 'IDR')}
                        </Typography>
                        {!t.synced && (
                          <Chip
                            label="Pending"
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.55rem',
                              backgroundColor: 'rgba(245,158,11,0.1)',
                              color: '#b45309',
                              mt: 0.5,
                              borderRadius: '4px',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
