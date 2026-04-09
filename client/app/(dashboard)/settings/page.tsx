'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { getPreference, setPreference } from '@/app/lib/db';

const CURRENCIES = ['IDR', 'USD', 'EUR', 'SGD'];

interface SettingRowProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  primary: string;
  secondary: string;
  control: React.ReactNode;
  noBorder?: boolean;
}

function SettingRow({ icon: Icon, iconColor, iconBg, primary, secondary, control, noBorder }: SettingRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2.25,
        borderBottom: noBorder ? 'none' : '1px solid rgba(194, 198, 214, 0.12)',
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: '#f7f8fc' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 19, color: iconColor }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#131b2e', lineHeight: 1.3 }}>
            {primary}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#9ea3b0', mt: 0.2 }}>
            {secondary}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 2, flexShrink: 0 }}>
        {control}
      </Box>
    </Box>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    biometrics: false,
    autoSync: true,
  });
  const [defaultCurrency, setDefaultCurrency] = useState('IDR');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const n = await getPreference('notifications', true);
      const b = await getPreference('biometrics', false);
      const s = await getPreference('autoSync', true);
      const c = await getPreference('defaultCurrency', 'IDR');
      setSettings({ notifications: n, biometrics: b, autoSync: s });
      setDefaultCurrency(c);
    }
    loadSettings();
  }, []);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    if (key === 'notifications' && newValue && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
      new Notification('BudgetFlow', {
        body: 'Notifications are now enabled!',
        icon: '/icons/icon-192.png',
      });
    }
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    await setPreference(key, newValue);
    showSuccess('Setting updated');
  };

  const handleCurrencyChange = async (value: string) => {
    setDefaultCurrency(value);
    await setPreference('defaultCurrency', value);
    showSuccess('Default currency updated');
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2500);
  };

  return (
    <Box>
      {/* ── Page Header ── */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: '#0058be', display: 'block', mb: 0.5, letterSpacing: '0.15em', fontSize: '0.6875rem' }}
        >
          PREFERENCES
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
          Settings
        </Typography>
      </Box>

      {/* Success toast */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: '14px', fontSize: '0.875rem' }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* ── Section: Preferences ── */}
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#9ea3b0',
          mb: 1.5,
          px: 0.5,
        }}
      >
        GENERAL
      </Typography>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(194, 198, 214, 0.18)',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <SettingRow
          icon={NotificationsRoundedIcon}
          iconColor="#0058be"
          iconBg="rgba(0, 88, 190, 0.09)"
          primary="Push Notifications"
          secondary="Receive alerts for large expenses"
          control={
            <Switch
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
              color="primary"
              size="small"
            />
          }
        />
        <SettingRow
          icon={CloudSyncRoundedIcon}
          iconColor="#006c49"
          iconBg="rgba(0, 108, 73, 0.09)"
          primary="Automatic Sync"
          secondary="Sync data when online"
          control={
            <Switch
              checked={settings.autoSync}
              onChange={() => handleToggle('autoSync')}
              color="primary"
              size="small"
            />
          }
        />
        <SettingRow
          icon={SecurityRoundedIcon}
          iconColor="#b90538"
          iconBg="rgba(185, 5, 56, 0.09)"
          primary="Biometric Lock"
          secondary="Secure with fingerprint or face"
          control={
            <Switch
              checked={settings.biometrics}
              onChange={() => handleToggle('biometrics')}
              color="primary"
              size="small"
            />
          }
          noBorder
        />
      </Box>

      {/* ── Section: Localization ── */}
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#9ea3b0',
          mb: 1.5,
          px: 0.5,
        }}
      >
        LOCALIZATION
      </Typography>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(194, 198, 214, 0.18)',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <SettingRow
          icon={LanguageRoundedIcon}
          iconColor="#b45309"
          iconBg="rgba(245, 158, 11, 0.1)"
          primary="Default Currency"
          secondary="Used for new transactions"
          noBorder
          control={
            <FormControl variant="standard" size="small">
              <Select
                value={defaultCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                disableUnderline
                sx={{ fontWeight: 700, color: '#0058be', fontSize: '0.875rem' }}
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: '0.875rem' }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        />
      </Box>

      {/* ── App Info ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 3,
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 14, color: '#c2c6d6' }} />
        <Typography sx={{ fontSize: '0.8125rem', color: '#c2c6d6', fontWeight: 500 }}>
          BudgetFlow · Version 1.0.0 (Beta)
        </Typography>
      </Box>
    </Box>
  );
}
