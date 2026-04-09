'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Alert,
  Skeleton,
  Tooltip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FlightRoundedIcon from '@mui/icons-material/FlightRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addLocalCategory, updateLocalCategory, deleteLocalCategory } from '../../lib/db';
import { useSyncContext } from '../../components/NetworkProvider';
import api from '../../lib/api';
import type { DBCategory } from '../../lib/db';

// ===== Icon Selection System =====

const CATEGORY_ICONS: { name: string; icon: React.ReactElement; label: string }[] = [
  { name: 'ShoppingCart', icon: <ShoppingCartRoundedIcon fontSize="small" />, label: 'Shopping' },
  { name: 'Restaurant', icon: <RestaurantRoundedIcon fontSize="small" />, label: 'Food' },
  { name: 'DirectionsCar', icon: <DirectionsCarRoundedIcon fontSize="small" />, label: 'Transport' },
  { name: 'Home', icon: <HomeRoundedIcon fontSize="small" />, label: 'Housing' },
  { name: 'LocalHospital', icon: <LocalHospitalRoundedIcon fontSize="small" />, label: 'Health' },
  { name: 'School', icon: <SchoolRoundedIcon fontSize="small" />, label: 'Education' },
  { name: 'Flight', icon: <FlightRoundedIcon fontSize="small" />, label: 'Travel' },
  { name: 'SportsEsports', icon: <SportsEsportsRoundedIcon fontSize="small" />, label: 'Entertainment' },
  { name: 'Work', icon: <WorkRoundedIcon fontSize="small" />, label: 'Work' },
  { name: 'CardGiftcard', icon: <CardGiftcardRoundedIcon fontSize="small" />, label: 'Gifts' },
  { name: 'AttachMoney', icon: <AttachMoneyRoundedIcon fontSize="small" />, label: 'Income' },
  { name: 'MoreHoriz', icon: <MoreHorizRoundedIcon fontSize="small" />, label: 'Other' },
];

const CATEGORY_COLORS = [
  '#b90538', '#006c49', '#0058be', '#f59e0b',
  '#7c3aed', '#db2777', '#0891b2', '#16a34a',
  '#dc2626', '#2563eb', '#9333ea', '#ea580c',
];

function getCategoryIconElement(iconName?: string): React.ReactElement {
  const found = CATEGORY_ICONS.find(i => i.name === iconName);
  return found?.icon ?? <MoreHorizRoundedIcon fontSize="small" />;
}

// Validate category name (at least 1 char, max 50)
function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Category name is required';
  if (name.trim().length > 50) return 'Name too long (max 50 characters)';
  return null;
}

export default function CategoriesPage() {
  const { isOnline, refreshPendingCount } = useSyncContext();

  // Live reactive query — auto-updates when IndexedDB changes
  const categories = useLiveQuery(
    () => db.categories.toArray()
  ) as DBCategory[] | undefined;

  const loading = categories === undefined;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state (manual, no tanstack-form dependency)
  const [editingCat, setEditingCat] = useState<DBCategory | null>(null);
  const [catType, setCatType] = useState<'income' | 'expense'>('expense');
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('MoreHoriz');
  const [catColor, setCatColor] = useState('#b90538');
  const [nameError, setNameError] = useState('');

  const incomeCategories = useMemo(
    () => (categories || []).filter((c) => c.type === 'income'),
    [categories]
  );
  const expenseCategories = useMemo(
    () => (categories || []).filter((c) => c.type === 'expense'),
    [categories]
  );

  const handleSubmit = async () => {
    const validationError = validateName(catName);
    if (validationError) {
      setNameError(validationError);
      return;
    }
    setNameError('');
    setError('');
    setIsSubmitting(true);

    const data = { name: catName.trim(), type: catType, icon: catIcon, color: catColor };

    try {
      if (editingCat) {
        const catId = editingCat.serverId || editingCat.localId?.toString();
        if (!catId) throw new Error('Category ID missing');
        await updateLocalCategory(catId.toString(), data);

        if (isOnline) {
          try { await api.put(`/api/categories/${catId}`, data); } catch { /* Sync later */ }
        }
        setSuccess(`Category "${data.name}" updated`);
      } else {
        await addLocalCategory(data);

        if (isOnline) {
          try { await api.post('/api/categories', data); } catch { /* Sync later */ }
        }
        setSuccess(`Category "${data.name}" added`);
      }

      await refreshPendingCount();
      setDialogOpen(false);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingCat) return;
    const catId = editingCat.serverId || editingCat.localId?.toString();
    if (!catId) return;

    if (!confirm(`Are you sure you want to delete "${editingCat.name}"?`)) return;

    try {
      setIsSubmitting(true);
      setError('');
      await deleteLocalCategory(catId.toString());

      if (isOnline) {
        try { await api.delete(`/api/categories/${catId}`); } catch { /* Sync later */ }
      }

      await refreshPendingCount();
      setSuccess('Category deleted');
      setDialogOpen(false);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCatName('');
    setCatType('expense');
    setCatIcon('MoreHoriz');
    setCatColor('#b90538');
    setEditingCat(null);
    setNameError('');
    setError('');
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (c: DBCategory) => {
    setEditingCat(c);
    setCatType(c.type as 'income' | 'expense');
    setCatName(c.name);
    setCatIcon(c.icon || 'MoreHoriz');
    setCatColor(c.color || '#b90538');
    setError('');
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant="rounded" height={60} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  const renderCategoryGroup = (
    title: string,
    icon: React.ReactElement,
    cats: DBCategory[],
    accentColor: string
  ) => (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(194, 198, 214, 0.18)',
        p: 3,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        {icon}
        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#131b2e', letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        <Chip
          label={cats.length}
          size="small"
          sx={{
            ml: 'auto',
            height: 22,
            fontSize: '0.6875rem',
            fontWeight: 700,
            backgroundColor: `${accentColor}12`,
            color: accentColor,
            borderRadius: '7px',
          }}
        />
      </Box>

      {cats.length === 0 ? (
        <Typography sx={{ color: '#9ea3b0', fontSize: '0.875rem', py: 1 }}>
          No {title.toLowerCase()} categories yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cats.map((c) => (
            <Chip
              key={c.localId || c.serverId}
              icon={
                <Box sx={{ color: c.color || accentColor, display: 'flex', alignItems: 'center', ml: '8px !important' }}>
                  {getCategoryIconElement(c.icon)}
                </Box>
              }
              label={c.name}
              onClick={() => openEditDialog(c)}
              sx={{
                borderRadius: '10px',
                px: 0.5,
                fontWeight: 600,
                fontSize: '0.8125rem',
                backgroundColor: `${c.color || accentColor}10`,
                color: c.color || accentColor,
                border: `1px solid ${c.color || accentColor}25`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: `${c.color || accentColor}20`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${c.color || accentColor}20`,
                },
                ...(!c.synced ? { borderStyle: 'dashed', opacity: 0.75 } : {}),
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 5 }}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: '#0058be', display: 'block', mb: 0.5, letterSpacing: '0.15em', fontSize: '0.6875rem' }}
          >
            ORGANIZE
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
            Categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          sx={{ flexShrink: 0 }}
        >
          Add Category
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '14px', fontSize: '0.875rem' }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Category Groups */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {renderCategoryGroup(
          'Income',
          <TrendingUpRoundedIcon sx={{ color: '#006c49', fontSize: 22 }} />,
          incomeCategories,
          '#006c49'
        )}
        {renderCategoryGroup(
          'Expenses',
          <TrendingDownRoundedIcon sx={{ color: '#b90538', fontSize: 22 }} />,
          expenseCategories,
          '#b90538'
        )}
      </Box>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); resetForm(); }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          {editingCat ? 'Edit Category' : 'New Category'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Type Toggle */}
          <ToggleButtonGroup
            value={catType}
            exclusive
            onChange={(_: React.MouseEvent<HTMLElement>, val: string | null) => val && setCatType(val as 'income' | 'expense')}
            fullWidth
            sx={{
              my: 2,
              '& .MuiToggleButton-root': {
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
              },
            }}
          >
            <ToggleButton value="expense">Expense</ToggleButton>
            <ToggleButton value="income">Income</ToggleButton>
          </ToggleButtonGroup>

          {/* Name Field */}
          <TextField
            fullWidth
            label="Category Name"
            placeholder="e.g. Groceries, Salary"
            value={catName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCatName(e.target.value); setNameError(''); }}
            error={!!nameError}
            helperText={nameError}
            sx={{ mb: 2.5 }}
          />

          {/* Color Picker */}
          <Typography variant="caption" sx={{ color: '#727785', fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
            COLOR
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
            {CATEGORY_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => setCatColor(color)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: catColor === color ? '2.5px solid #131b2e' : '2.5px solid transparent',
                  boxShadow: catColor === color ? `0 0 0 2px ${color}60` : 'none',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'scale(1.15)' },
                }}
              />
            ))}
          </Box>

          {/* Icon Picker */}
          <Typography variant="caption" sx={{ color: '#727785', fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
            ICON
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {CATEGORY_ICONS.map((item) => (
              <Tooltip key={item.name} title={item.label} arrow>
                <Box
                  onClick={() => setCatIcon(item.name)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: catIcon === item.name ? `${catColor}20` : '#f8f9fc',
                    color: catIcon === item.name ? catColor : '#727785',
                    border: catIcon === item.name ? `1.5px solid ${catColor}` : '1.5px solid transparent',
                    transition: 'all 0.15s',
                    '&:hover': { backgroundColor: `${catColor}15`, color: catColor },
                  }}
                >
                  {item.icon}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: editingCat ? 'space-between' : 'flex-end' }}>
          {editingCat && (
            <Button
              color="error"
              onClick={handleDelete}
              disabled={isSubmitting}
              startIcon={<DeleteRoundedIcon />}
            >
              Delete
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => { setDialogOpen(false); resetForm(); }} sx={{ color: '#727785' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
              sx={{
                background:
                  catType === 'income'
                    ? 'linear-gradient(135deg, #006c49, #4edea3)'
                    : 'linear-gradient(135deg, #0058be, #2170e4)',
              }}
            >
              {isSubmitting ? 'Saving...' : (editingCat ? 'Save' : 'Create')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
