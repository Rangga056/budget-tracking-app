'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, saveTransaction, getPreference } from '../lib/db';
import { useSyncContext } from './NetworkProvider';
import type { DBCategory } from '../lib/db';

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransactionDialog({ open, onClose, onSuccess }: TransactionDialogProps) {
  const { refreshPendingCount } = useSyncContext();

  const allCategories = useLiveQuery(
    () => db.categories.toArray()
  ) as DBCategory[] | undefined;

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getPreference('defaultCurrency', 'IDR').then(setCurrency);
    }
  }, [open]);

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date().toISOString().slice(0, 10));
    setReceiptFile(null);
    setServerError('');
    setType('expense');
    onClose();
  };

  const handleSubmit = async () => {
    setServerError('');
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setServerError('Please enter a valid positive amount');
      return;
    }
    if (!description.trim()) {
      setServerError('Description is required');
      return;
    }
    if (!categoryId) {
      setServerError('Please select a category');
      return;
    }

    setIsLoading(true);
    try {
      const signedAmount = type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount);
      const receiptUrl = receiptFile ? `local://${receiptFile.name}` : '';

      await saveTransaction({
        categoryId,
        amount: signedAmount,
        currency,
        description: description.trim(),
        receiptUrl,
        transactionDate: date,
      });

      await refreshPendingCount();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = allCategories || [];
  const filteredCategories = categories.filter((c) => c.type === type);

  const isIncome = type === 'income';
  const accentColor = isIncome ? '#006c49' : '#0058be';
  const accentBg = isIncome ? 'rgba(0,108,73,0.08)' : 'rgba(0,88,190,0.08)';
  const saveBg = isIncome
    ? 'linear-gradient(135deg, #006c49, #00a36c)'
    : 'linear-gradient(135deg, #0058be, #2170e4)';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundImage: 'none',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#131b2e', letterSpacing: '-0.02em' }}>
          Add Transaction
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#9ea3b0',
            backgroundColor: '#f5f6fa',
            borderRadius: '8px',
            width: 28,
            height: 28,
            '&:hover': { backgroundColor: '#ecedf3', color: '#131b2e' },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(194, 198, 214, 0.35)' }} />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {serverError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontSize: '0.8125rem' }}>
            {serverError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Type Toggle */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, val) => {
              if (val) { setType(val); setCategoryId(''); }
            }}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 1.125,
                color: '#727785',
                borderColor: 'rgba(194, 198, 214, 0.5)',
              },
              '& .Mui-selected': {
                color: `${accentColor} !important`,
                backgroundColor: `${accentBg} !important`,
                borderColor: `${accentColor}40 !important`,
              },
            }}
          >
            <ToggleButton value="expense">
              <TrendingDownRoundedIcon sx={{ mr: 0.75, fontSize: 17 }} />
              Expense
            </ToggleButton>
            <ToggleButton value="income">
              <TrendingUpRoundedIcon sx={{ mr: 0.75, fontSize: 17 }} />
              Income
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Amount + Currency */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <FormControl sx={{ minWidth: 90 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Cur</InputLabel>
              <Select
                value={currency}
                label="Cur"
                size="small"
                onChange={(e) => setCurrency(e.target.value)}
                sx={{ borderRadius: '10px', fontSize: '0.875rem' }}
              >
                <MenuItem value="IDR">IDR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="SGD">SGD</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Amount"
              size="small"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.875rem' } }}
            />
          </Box>

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            size="small"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.875rem' } }}
          />

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.875rem' }}>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value)}
              sx={{ borderRadius: '10px', fontSize: '0.875rem' }}
            >
              {filteredCategories.length === 0 && (
                <MenuItem disabled>No {type} categories — create one first</MenuItem>
              )}
              {filteredCategories.map((c) => (
                <MenuItem key={c.serverId || c.localId} value={c.serverId || ''}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date */}
          <TextField
            fullWidth
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.875rem' } }}
          />

          {/* Attach Receipt */}
          <Box>
            <input
              type="file"
              accept="image/*"
              id="receipt-upload-dialog"
              style={{ display: 'none' }}
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="receipt-upload-dialog">
              <Button
                component="span"
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={<AttachFileRoundedIcon sx={{ fontSize: '17px !important' }} />}
                sx={{
                  borderRadius: '10px',
                  justifyContent: 'flex-start',
                  borderColor: 'rgba(194, 198, 214, 0.6)',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: receiptFile ? 600 : 400,
                  color: receiptFile ? '#131b2e' : '#9ea3b0',
                  py: 0.875,
                  '&:hover': {
                    borderColor: accentColor,
                    color: accentColor,
                    backgroundColor: accentBg,
                  },
                }}
              >
                {receiptFile ? receiptFile.name : 'Attach Receipt'}
              </Button>
            </label>
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(194, 198, 214, 0.35)' }} />

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{
            fontWeight: 600,
            color: '#727785',
            borderRadius: '10px',
            px: 2.5,
            '&:hover': { backgroundColor: '#f5f6fa' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: '10px',
            px: 3.5,
            fontWeight: 700,
            fontSize: '0.875rem',
            background: saveBg,
            boxShadow: 'none',
            '&:hover': { boxShadow: `0 4px 16px ${accentColor}40` },
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
