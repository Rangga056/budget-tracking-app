'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { useForm } from '@tanstack/react-form';
import { transactionSchema } from '../../../lib/validators';
import { db, addLocalTransaction, getPreference } from '../../../lib/db';
import { useSyncContext } from '../../../components/NetworkProvider';
import api from '../../../lib/api';
import type { DBCategory } from '../../../lib/db';

export default function NewTransactionPage() {
  const router = useRouter();
  const { isOnline, refreshPendingCount } = useSyncContext();
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      amount: '',
      currency: 'IDR',
      description: '',
      category_id: '',
      transaction_date: new Date().toISOString().slice(0, 10),
      receipt_url: '',
      type: 'expense' as 'income' | 'expense',
    },
    onSubmit: async ({ value }) => {
      setServerError('');
      const result = transactionSchema.safeParse({ ...value, type });
      if (!result.success) {
        setServerError(result.error.errors[0]?.message || 'Validation failed');
        return;
      }
      setIsLoading(true);
      try {
        const amount = parseFloat(value.amount);
        const signedAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
        const receiptUrl = receiptFile ? `local://${receiptFile.name}` : '';

        await addLocalTransaction({
          categoryId: value.category_id,
          amount: signedAmount,
          currency: value.currency,
          description: value.description,
          receiptUrl,
          transactionDate: value.transaction_date,
        });

        if (isOnline) {
          try {
            await api.post('/api/transactions', {
              category_id: value.category_id,
              amount: String(Math.abs(amount)),
              currency: value.currency,
              description: value.description,
              receipt_url: receiptUrl,
              transaction_date: value.transaction_date,
            });
          } catch {
            // Sync queue will handle it
          }
        }

        await refreshPendingCount();
        setSuccess(true);
        setTimeout(() => router.push('/transactions'), 800);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    async function load() {
      const cats = await db.categories.toArray();
      setCategories(cats);
      const defCurrency = await getPreference('defaultCurrency', 'IDR');
      form.setFieldValue('currency', defCurrency);
    }
    load();
  }, [form]);

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', px: { xs: 0, md: 1 } }}>
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 3, color: '#727785', fontWeight: 500, pl: 0 }}
      >
        Back
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: '#0058be', display: 'block', mb: 0.5, letterSpacing: '0.15em', fontSize: '0.6875rem' }}
        >
          NEW ENTRY
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
          Add Transaction
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
          Transaction saved{!isOnline ? ' (offline — will sync later)' : ''}!
        </Alert>
      )}
      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {serverError}
        </Alert>
      )}

      {/* Type Toggle */}
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, val) => val && setType(val)}
        fullWidth
        sx={{
          mb: 3.5,
          '& .MuiToggleButton-root': {
            py: 1.25,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
          '& .Mui-selected': {
            color: type === 'income' ? '#006c49' : '#b90538',
            backgroundColor:
              type === 'income' ? 'rgba(0,108,73,0.08)' : 'rgba(185,5,56,0.08)',
          },
        }}
      >
        <ToggleButton value="expense">
          <TrendingDownRoundedIcon sx={{ mr: 1, fontSize: 18 }} />
          Expense
        </ToggleButton>
        <ToggleButton value="income">
          <TrendingUpRoundedIcon sx={{ mr: 1, fontSize: 18 }} />
          Income
        </ToggleButton>
      </ToggleButtonGroup>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Amount and Currency */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <form.Field name="currency">
              {(field) => (
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Cur</InputLabel>
                  <Select
                    value={field.state.value}
                    label="Cur"
                    onChange={(e) => field.handleChange(e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="IDR">IDR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="SGD">SGD</MenuItem>
                  </Select>
                </FormControl>
              )}
            </form.Field>

            <form.Field name="amount">
              {(field) => (
                <TextField
                  fullWidth
                  label="Amount"
                  placeholder="0.00"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  slotProps={{
                    input: {
                      type: 'number',
                      inputProps: { step: '0.01', min: '0' },
                    },
                  }}
                />
              )}
            </form.Field>
          </Box>

          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <TextField
                fullWidth
                label="Description"
                placeholder="What was this for?"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0] ? (typeof field.state.meta.errors[0] === 'object' ? (field.state.meta.errors[0] as any).message : field.state.meta.errors[0]) : undefined}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            )}
          </form.Field>

          {/* Category */}
          <form.Field name="category_id">
            {(field) => (
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={field.state.value}
                  label="Category"
                  onChange={(e) => field.handleChange(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  {filteredCategories.length === 0 && (
                    <MenuItem disabled>No {type} categories</MenuItem>
                  )}
                  {filteredCategories.map((c) => (
                    <MenuItem key={c.localId || c.serverId} value={c.serverId || ''}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </form.Field>

          {/* Date */}
          <form.Field name="transaction_date">
            {(field) => (
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            )}
          </form.Field>

          {/* Attach Receipt */}
          <Box>
            <input
              type="file"
              accept="image/*"
              id="receipt-upload-page"
              style={{ display: 'none' }}
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="receipt-upload-page">
              <Button
                component="span"
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={<AttachFileRoundedIcon />}
                sx={{
                  borderRadius: '10px',
                  justifyContent: 'flex-start',
                  borderColor: 'divider',
                  textTransform: 'none',
                  color: receiptFile ? '#131b2e' : 'text.secondary',
                  fontWeight: receiptFile ? 600 : 400,
                  py: 1.375,
                }}
              >
                {receiptFile ? receiptFile.name : 'Attach Receipt'}
              </Button>
            </label>
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.5,
              borderRadius: '10px',
              fontWeight: 700,
              background:
                type === 'income'
                  ? 'linear-gradient(135deg, #006c49, #4edea3)'
                  : 'linear-gradient(135deg, #b90538, #e8476a)',
            }}
          >
            {isLoading
              ? 'Saving...'
              : isOnline
                ? `Save ${type === 'income' ? 'Income' : 'Expense'}`
                : 'Save Offline'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
